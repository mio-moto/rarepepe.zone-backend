import {
  type CamelizedDiscordInteractionData,
  type DiscordInteraction,
  type DiscordInteractionData,
  DiscordMessageFlag,
  type InteractionResponse,
  type InteractionTypes,
} from "@discordeno/types"
import { loggerFactory } from "#/logging"
import { tryInvoke } from "#/utils/tryInvoke"
import type { AnyGatewayResult } from ".."
import {
  interactionName as getInteractionName,
  interactionTypeName as getInteractionTypeName,
  isAutocompleteInteraction,
  isChatInputApplicationCommandInteraction,
  isComponentInteraction,
  isContextMenuInteraction,
  isModalInteraction,
  isPingInteraction,
} from "../interactionDiscriminators"
import {
  createInteractionResponse_DeferredChannelMessage,
  createInteractionResponse_DeferredMessageUpdate,
  createInteractionResponse_Pong,
} from "../messagePayloads"
import type { DiscordEnvironment, Rabscuttle } from "../rabscuttle"
import type {
  ChatInputApplicationCommandInteraction,
  Interaction,
  InteractionResponseSelector,
  UnknownInteraction,
} from "../types"
import type { DiscordAPIClient } from "./apiClient"
import { buildInteractionClient } from "./interactionClient"

const GatewayTimeout = 2_500
const logger = loggerFactory("WEBHK:Discord:Client")

// type InteractionResponse = DiscordInteractio;
type InteractionDefer = DiscordMessageFlag.Ephemeral
type BaseInteraction<Type extends InteractionTypes, Data extends DiscordInteractionData> = DiscordInteraction & {
  type: Type
  data: Data
}

export interface PluginClient<
  Response extends InteractionResponse,
  Defer extends InteractionDefer,
  Interaction extends BaseInteraction<Type, Data>,
  Type extends InteractionTypes,
  Data extends DiscordInteractionData,
> {
  reply: (response: Response) => Promise<void>
  defer: (options: Defer) => Promise<void>
  interaction: Interaction
}

enum ResponseState {
  NotReplied = 0,
  Deferred = 1,
  Replied = 2,
}

type GatewayResultResolver = ReturnType<typeof Promise.withResolvers<AnyGatewayResult>>["resolve"]

const selectDeferCreator = (interaction: UnknownInteraction) => {
  if (
    isAutocompleteInteraction(interaction) ||
    isChatInputApplicationCommandInteraction(interaction) ||
    isContextMenuInteraction(interaction)
  ) {
    return createInteractionResponse_DeferredChannelMessage
  }

  if (isComponentInteraction(interaction) || isModalInteraction(interaction)) {
    return createInteractionResponse_DeferredMessageUpdate
  }

  throw new Error("No defer method for this interaction")
}

const recordCaches = (interaction: UnknownInteraction, client: DiscordAPIClient) => {
  if (!("data" in interaction) || typeof interaction.data !== "object") {
    return
  }

  const data = interaction.data as CamelizedDiscordInteractionData
  if (!data.resolved) {
    return
  }

  // omitted are attachments, members, channels
  // attachments: not a concern
  // members: not handled yet
  // channels: channels are partials, so handling them is tricky
  const { messages, users, roles } = data.resolved
  // biome-ignore lint/suspicious/noExplicitAny: allowed
  const insertInto = <T>(entries: Record<any, T> | undefined, set: (entry: T) => unknown) => {
    if (!entries) {
      return
    }

    for (const entry of Object.values(entries)) {
      set(entry)
    }
  }

  insertInto(messages, client.message.cache.set)
  insertInto(users, client.user.cache.set)

  if (interaction.guildId) {
    insertInto(roles, (role) => client.role.cache.set({ roles: [role], guildId: `${interaction.guildId}` }))
  }
}

export const dispatchInteractionResponseClient = <I extends Interaction>(
  resolve: GatewayResultResolver,
  interaction: I,
  environment: DiscordEnvironment,
  rabs: Rabscuttle,
) => {
  recordCaches(interaction, environment.discord.client)

  if (isPingInteraction(interaction)) {
    logger.silly("Interaction is PING, responding with PONG")
    resolve({ status: 200, body: createInteractionResponse_Pong() })
    return
  }

  const deferCreator = selectDeferCreator(interaction)
  const interactionName = getInteractionName(interaction)
  const interactionType = getInteractionTypeName(interaction)
  let responseState = ResponseState.NotReplied
  setTimeout(() => {
    // just in case, if the handle has not been cancelled
    if (responseState === ResponseState.NotReplied) {
      return
    }
    responseState = ResponseState.Deferred
    logger.info(
      `An interaction for '${interactionType} ${interactionName}' took more than ${GatewayTimeout}ms, deferring response`,
    )
    resolve({ status: 200, body: deferCreator() })
  }, 2500)

  if (isChatInputApplicationCommandInteraction(interaction)) {
    // const message = interactionMessageStrategy({ interaction, environment, resolve, currentState, setState });
    // const modal = modalStrategy({ interaction, environment, resolve, currentState, setState });
    const client = buildInteractionClient(interaction, environment, resolve)

    const command = rabs.interactions[interactionName]
    if (!command) {
      logger.warn(`An interaction '${interaction.id}' (command name: '${interaction.data.name}') has no plugin`)
      type T = InteractionResponseSelector<ChatInputApplicationCommandInteraction>
      client.reply({
        content: "Unknown interaction command, sorry.",
        flags: DiscordMessageFlag.Ephemeral,
      })
      return
    }
    tryInvoke(() => {
      logger.debug(`Invoking interaction '${interaction.id}' against plugin with name '${command.name}'`)
      command.onNewInteraction(client, environment)
    })
    return
  }

  if (isContextMenuInteraction(interaction)) {
    const client = buildInteractionClient(interaction, environment, resolve)

    const command = rabs.contextMenu[interactionName]
    if (!command) {
      logger.warn(
        `A context menu interaction '${interaction.id}' (command name: '${interaction.data.name}') has no plugin`,
      )
      client.reply({
        content: "Unknown context manu interaction, sorry.",
        flags: DiscordMessageFlag.Ephemeral,
      })
      return
    }
    tryInvoke(() => {
      logger.debug(`Invoking context menu interaction '${interaction.id}' against plugin with name '${command.name}'`)
      command.onNewContextAction(client, environment)
    })
    return
  }

  if (isAutocompleteInteraction(interaction)) {
    const client = buildInteractionClient(interaction, environment, resolve)
    const command = rabs.autocompletes[interactionName]
    if (!command) {
      logger.warn(
        `A autocomplete interaction '${interaction.id}' (from command name: '${interaction.data.name}') has no plugin`,
      )
      client.autocomplete({ choices: [] })
      return
    }
    tryInvoke(() => {
      logger.debug(`Invoking autocomplete interaction '${interaction.id}' against plugin with name '${command.name}'`)
      command.onAutoComplete(client, environment)
    })
    return
  }

  if (isComponentInteraction(interaction)) {
    const client = buildInteractionClient(interaction, environment, resolve)

    const componentId = interaction.data.customId
    const plugins = rabs.components.filter((x) => x.publishedComponentIds.includes(componentId))
    if (plugins.length <= 0) {
      logger.warn(
        `No plugin has a component registered for interaction '${interaction.id}' (component name: '${componentId}')`,
      )
      // returning here the message should just do a non-edit and end the interaction
      // @ts-expect-error There's a typing issue I cannot figure out
      message.reply(interaction.message)
      return
    }
    tryInvoke(() => {
      logger.debug(
        `Invoking component interaction '${interaction.id}' (component name: ${componentId}) against plugin${
          plugins.length > 1 ? "s" : ""
        }: [${plugins.map((x) => x.name).join(", ")}]`,
      )
      for (const plugin of plugins) {
        plugin.onNewButtonClick(client, environment)
      }
    })
    return
  }

  if (isModalInteraction(interaction)) {
    const client = buildInteractionClient(interaction, environment, resolve)
    const modalId = interaction.data.customId
    const plugins = rabs.modals.filter((x) => x.publishedModalIds.includes(modalId))
    if (plugins.length <= 0) {
      logger.warn(`No plugin has a modal registered for interaction '${interaction.id}' (modal name: '${modalId}')`)
      // returning here the message should just do a non-edit and end the interaction
      // @ts-expect-error The message components are identical, but the typings are slightly off
      client.edit(interaction.message)
      return
    }
    tryInvoke(() => {
      logger.debug(
        `Invoking modal interaction '${interaction.id}' (modal name: ${modalId}) against plugin${
          plugins.length > 1 ? "s" : ""
        }: [${plugins.map((x) => x.name).join(", ")}]`,
      )
      for (const plugin of plugins) {
        plugin.onModalSubmit(client, environment)
      }
    })
    return
  }

  logger.warn(
    // biome-ignore lint/complexity/useLiteralKeys: this is a never situation, using an accessor is forbidden
    `An interaction '${interaction["id"]}' (${interactionType} / ${interactionName}) fell through all types and handlers. This should not have happened.`,
  )
  resolve({ status: 400 })
}
