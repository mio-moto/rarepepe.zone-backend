import {
  type CamelizedDiscordMessage,
  type DiscordMessageFlag,
  InteractionResponseTypes,
  InteractionTypes,
} from "@discordeno/types"
import type {
  ApplicationCommandAutocompleteInteraction as AutocompleteInteraction,
  ApplicationCommandAutocompleteResultData,
  ChannelMessageWithSourceResponseData,
  ChatInputApplicationCommandInteraction,
  ContextMenuApplicationCommandInteraction,
  Interaction,
  InteractionResponse,
  MessageComponentInteraction,
  MessageContextMenuApplicationCommandInteraction,
  ModalResponseData,
  ModalSubmitInteraction,
  PingInteraction,
  UpdateMessageResponseData,
  UserContextMenuApplicationCommandInteraction,
} from "../types"
import type { DiscordEnvironment } from "../rabscuttle"
import type { AnyGatewayResult } from ".."
import {
  createInteractionResponse_ChannelMessage,
  createInteractionResponse_DeferredChannelMessage,
  createInteractionResponse_DeferredMessageUpdate,
  createInteractionResponse_Pong,
  createInteractionResponse_Modal,
  createInteractionResponse_UpdateMessage,
  createInteractionResponse_PremiumRequired,
  createInteractionResponse_Autocomplete,
} from "../messagePayloads"

enum ResponseKind {
  NotReplied = 0,
  Deferred = 1,
  Replied = 2,
}

type IncludesInteraction<I extends Interaction> = {
  data: I
}

type CanReply = {
  reply: (content: ChannelMessageWithSourceResponseData) => Promise<void>
}

type CanDefer = {
  defer: (flags?: DiscordMessageFlag.Ephemeral) => Promise<void>
}

type CanGetReply = {
  fetchReply: () => Promise<CamelizedDiscordMessage>
}

type CanShowModal = {
  modal: (modal: ModalResponseData) => Promise<void>
}

type CanEdit = {
  edit: (content: UpdateMessageResponseData) => Promise<void>
}

type CanRequirePremium = {
  requirePremium: () => Promise<void>
}

type CanPong = {
  pong: () => Promise<void>
}

type CanDeleteReply = {
  delete: () => Promise<void>
}

type CanFollowup = {
  followup: (content: ChannelMessageWithSourceResponseData) => Promise<void>
}

type CanSuggestAutocomplete = {
  autocomplete: (choices: ApplicationCommandAutocompleteResultData) => Promise<void>
}

type CanDoAll<I extends Interaction> = CanReply &
  CanDefer &
  CanGetReply &
  CanShowModal &
  CanEdit &
  CanRequirePremium &
  CanPong &
  CanDeleteReply &
  CanFollowup &
  CanSuggestAutocomplete &
  IncludesInteraction<I>

type CanHandleReplies = CanReply & CanGetReply & CanEdit & CanDeleteReply
type CanHandleFollowups = CanDefer & CanFollowup
type CanHandlePong = CanPong
type CanHandleModal = CanShowModal
type CanHandlePremium = CanRequirePremium

export type PingInteractionClient = CanHandlePong & IncludesInteraction<PingInteraction>

type ApplicationCommandClient = CanHandleReplies & CanHandleFollowups & CanHandleModal & CanHandlePremium
export type ChatInputApplicationCommandInteractionClient = ApplicationCommandClient &
  IncludesInteraction<ChatInputApplicationCommandInteraction>
export type UserContextMenuApplicationCommandInteractionClient = ApplicationCommandClient &
  IncludesInteraction<UserContextMenuApplicationCommandInteraction>
export type MessageContextMenuApplicationCommandInteractionClient = ApplicationCommandClient &
  IncludesInteraction<MessageContextMenuApplicationCommandInteraction>
export type ContextMenuApplicationCommandInteractionClient = ApplicationCommandClient &
  IncludesInteraction<UserContextMenuApplicationCommandInteraction | MessageContextMenuApplicationCommandInteraction>
export type ModalSubmitInteractionClient = CanDefer & CanEdit & IncludesInteraction<ModalSubmitInteraction>
export type MessageComponentInteractionClient = CanDefer &
  CanEdit &
  CanGetReply &
  IncludesInteraction<MessageComponentInteraction>
export type AutocompleteInteractionClient = CanSuggestAutocomplete & IncludesInteraction<AutocompleteInteraction>

export type InteractionClientSelector<I extends Interaction> = I extends PingInteraction
  ? PingInteractionClient
  : I extends
        | ChatInputApplicationCommandInteraction
        | UserContextMenuApplicationCommandInteraction
        | MessageContextMenuApplicationCommandInteraction
    ? ChatInputApplicationCommandInteraction
    : I extends ModalSubmitInteraction
      ? ModalSubmitInteractionClient
      : I extends MessageComponentInteraction
        ? MessageComponentInteractionClient
        : I extends AutocompleteInteraction
          ? AutocompleteInteractionClient
          : never

type GatewayResultResolver = ReturnType<typeof Promise.withResolvers<AnyGatewayResult>>["resolve"]

const isDeferResponse = (response: InteractionResponse) => {
  switch (response.type) {
    case InteractionResponseTypes.DeferredChannelMessageWithSource:
    case InteractionResponseTypes.DeferredUpdateMessage:
      return true
    case InteractionResponseTypes.ApplicationCommandAutocompleteResult:
    case InteractionResponseTypes.ChannelMessageWithSource:
    case InteractionResponseTypes.Modal:
    case InteractionResponseTypes.Pong:
    case InteractionResponseTypes.PremiumRequired:
    case InteractionResponseTypes.UpdateMessage:
      return false
  }
}

export function buildInteractionClient(
  interaction: PingInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): PingInteractionClient
export function buildInteractionClient(
  interaction: ChatInputApplicationCommandInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): ChatInputApplicationCommandInteractionClient
export function buildInteractionClient(
  interaction: UserContextMenuApplicationCommandInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): UserContextMenuApplicationCommandInteractionClient
export function buildInteractionClient(
  interaction: MessageContextMenuApplicationCommandInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): MessageContextMenuApplicationCommandInteractionClient
export function buildInteractionClient(
  interaction: ContextMenuApplicationCommandInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): ContextMenuApplicationCommandInteractionClient
export function buildInteractionClient(
  interaction: MessageComponentInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): MessageComponentInteractionClient
export function buildInteractionClient(
  interaction: ModalSubmitInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): ModalSubmitInteractionClient
export function buildInteractionClient(
  interaction: AutocompleteInteraction,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): AutocompleteInteractionClient
export function buildInteractionClient<I extends Interaction>(
  interaction: I,
  environment: DiscordEnvironment,
  connectionResolve: GatewayResultResolver,
): CanDoAll<I> {
  type Response = {
    state: ResponseKind
    reply?: InteractionResponse
  }

  const connection: Response = {
    state: ResponseKind.NotReplied,
    reply: undefined,
  }

  const submitMessage = async (response: InteractionResponse) => {
    if (connection.state === ResponseKind.NotReplied) {
      connection.state = isDeferResponse(response) ? ResponseKind.Deferred : ResponseKind.Replied
      connection.reply = response
      connectionResolve({ status: 200, body: response })
      return
    }

    if (connection.state === ResponseKind.Deferred && isDeferResponse(response)) {
      throw new Error("Cannot defer an interaction that's currently deferred.")
    }

    await environment.discord.client.interactions.response.create(interaction.id, interaction.token, response)
    connection.state = ResponseKind.Replied
    connection.reply = response
  }

  const client = {
    data: interaction,
    reply: async (content: ChannelMessageWithSourceResponseData) => {
      await submitMessage(createInteractionResponse_ChannelMessage(content))
    },
    defer: async (flags?: DiscordMessageFlag.Ephemeral) => {
      switch (interaction.type) {
        case InteractionTypes.ApplicationCommand:
          await submitMessage(createInteractionResponse_DeferredChannelMessage(flags))
          break
        case InteractionTypes.MessageComponent:
        case InteractionTypes.ModalSubmit:
          await submitMessage(createInteractionResponse_DeferredMessageUpdate())
          break
        case InteractionTypes.ApplicationCommandAutocomplete:
        case InteractionTypes.Ping:
          throw new Error("Deferring is not possible with Autocomplete or Ping interactions")
      }
    },
    fetchReply: async (): Promise<CamelizedDiscordMessage> => {
      return await environment.discord.client.interactions.response.getOriginal(interaction.token)
    },
    modal: async (modal: ModalResponseData) => {
      await submitMessage(createInteractionResponse_Modal(modal))
    },
    edit: async (content: UpdateMessageResponseData) => {
      await submitMessage(createInteractionResponse_UpdateMessage(content))
    },
    requirePremium: async () => {
      await submitMessage(createInteractionResponse_PremiumRequired())
    },
    pong: async () => {
      await submitMessage(createInteractionResponse_Pong())
    },
    delete: async () => {
      await environment.discord.client.interactions.response.deleteOriginal(interaction.token)
    },
    followup: async (content: ChannelMessageWithSourceResponseData) => {
      await environment.discord.client.interactions.followup.create(interaction.token, content)
    },
    autocomplete: async (choices: ApplicationCommandAutocompleteResultData) => {
      submitMessage(createInteractionResponse_Autocomplete(choices))
    },
  }
  return client
}
