import { type RestManager, createRestManager } from "@discordeno/rest"
import type { BigString, CreateMessageOptions } from "@discordeno/types"
import { logger as denoLogger } from "@discordeno/utils"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loggerFactory } from "#/logging"
import { buildObjectCache } from "../objectCache"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = loggerFactory("WEBHK:Discord:Client")

export type DiscordAPIClient = ReturnType<typeof buildDiscordAPIClient>

// biome-ignore lint/suspicious/noExplicitAny: allowed
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => any ? P : never
// biome-ignore lint/suspicious/noExplicitAny: allowed
type FirstArg<F extends (...args: any) => any> = Parameters<F>[0]
// biome-ignore lint/suspicious/noExplicitAny: allowed
const compose = <F extends (...args: any) => any>(
  func: F,
  firstParam: FirstArg<F>,
): ((...args: OmitFirstArg<F>) => ReturnType<F>) => {
  return (...args: OmitFirstArg<F>) => func(firstParam, ...args)
}
const c = compose

const buildRequestCaches = (client: RestManager) => {
  const guildCache = buildObjectCache(client.getGuild, 0, (guild) => guild.id)
  const channelCache = buildObjectCache(client.getChannel, 0, (channel) => channel.id)
  const userCache = buildObjectCache(client.getUser, 0, (user) => user.id)
  const messageCache = buildObjectCache(client.getMessage, 0, (message) => message.id)
  const roleCache = buildObjectCache(
    async (...args: Parameters<typeof client.getRoles>) => {
      const response = await client.getRoles(...args)
      return {
        roles: response,
        guildId: args[0],
      }
    },
    0,
    (response) => `${response.guildId}`,
  )

  return {
    guilds: guildCache,
    channels: channelCache,
    users: userCache,
    messages: messageCache,
    roles: roleCache,
  }
}

export const buildDiscordAPIClient = (applicationId: string, token: string) => {
  const apiLogger = loggerFactory("WEBHK:Discord:Client")

  denoLogger.debug = (...args: Parameters<typeof denoLogger.debug>) => apiLogger.debug(args)
  denoLogger.error = (...args: Parameters<typeof denoLogger.debug>) => apiLogger.error(args)
  denoLogger.fatal = (...args: Parameters<typeof denoLogger.debug>) => apiLogger.crit(args)
  denoLogger.info = (...args: Parameters<typeof denoLogger.debug>) => apiLogger.info(args)
  denoLogger.warn = (...args: Parameters<typeof denoLogger.debug>) => apiLogger.warn(args)

  const client = createRestManager({
    token: token,
    applicationId: applicationId,
    version: 10,
  })
  client.preferSnakeCase(true)
  client.maxRetryCount = 5

  const caches = buildRequestCaches(client)

  return {
    commands: {
      global: {
        listAll: client.getGlobalApplicationCommands,
        create: client.createGlobalApplicationCommand,
        get: client.getGlobalApplicationCommand,
        edit: client.editGlobalApplicationCommand,
        delete: client.deleteGlobalApplicationCommand,
        overwriteAll: client.upsertGlobalApplicationCommands,
      },
      guild: {
        get: client.getGuildApplicationCommand,
        listAll: client.getGuildApplicationCommands,
        create: client.createGuildApplicationCommand,
        edit: client.editGuildApplicationCommand,
        delete: client.deleteGuildApplicationCommand,
        overwriteAll: client.upsertGuildApplicationCommands,
      },
    },
    interactions: {
      response: {
        create: client.sendInteractionResponse,
        getOriginal: client.getOriginalInteractionResponse,
        editOriginal: client.editOriginalInteractionResponse,
        deleteOriginal: client.deleteOriginalInteractionResponse,
      },
      followup: {
        // these list a "webhookId" as first parameter, this is substituted by applicationId
        // https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response
        create: client.sendFollowupMessage,
        get: client.getFollowupMessage,
        edit: client.editFollowupMessage,
        delete: client.deleteFollowupMessage,
      },
    },
    message: {
      get: caches.messages.get,
      cache: caches.messages,
      getMultiple: client.getMessages,
      create: client.sendMessage,
      replyTo: (
        channelId: BigString,
        // to be a successful reply, the request has to reference a message
        options: CreateMessageOptions & {
          messageReference: Required<Pick<CreateMessageOptions, "messageReference">>
        },
      ) => {
        return client.sendMessage(channelId, options)
      },
      edit: client.editMessage,
      delete: client.deleteMessage,
    },
    channel: {
      get: caches.channels.get,
      cache: caches.channels,
      create: client.createChannel,
      edit: client.editChannel,
      delete: client.deleteChannel,
    },
    guild: {
      get: caches.guilds.get,
      cache: caches.guilds,
      edit: client.editGuild,
      delete: client.deleteGuild,
      getChannels: client.getChannels,
      getMembers: client.getMembers,
    },
    user: {
      get: caches.users.get,
      cache: caches.users,
      myself: client.getCurrentUser,
    },
    role: {
      getAll: caches.roles.get,
      cache: caches.roles,
      create: client.createRole,
      edit: client.editRole,
      delete: client.deleteRole,
    },
  }
}
