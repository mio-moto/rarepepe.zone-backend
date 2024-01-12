/* eslint-disable @typescript-eslint/no-explicit-any */
import { loggerFactory } from "#/logging";
import axios, { AxiosPromise, AxiosResponse, isAxiosError } from "axios";
import { DefaultApiFactory, GuildResponse, GuildWithCountsResponse, MessageCreateRequest, UserResponse } from "./rest";
import rateLimit from "axios-rate-limit";
import { APIGuildTextChannel, GuildTextChannelType, ChannelType } from "discord-api-types/v10";
import { buildObjectCache } from "./objectCache";

const BaseUrl = "https://discord.com/api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = loggerFactory("WEBHK:Discord:Client");

export type DiscordAPIClient = ReturnType<typeof buildDiscordAPIClient>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => any ? P : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirstArg<F extends (...args: any) => any> = Parameters<F>[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compose = <F extends (...args: any) => any>(
    func: F,
    firstParam: FirstArg<F>,
): ((...args: OmitFirstArg<F>) => ReturnType<F>) => {
    return (...args: OmitFirstArg<F>) => func(firstParam, ...args);
};
const c = compose;

type OptionalAxiosPromise<T> = Promise<AxiosResponse<T> | undefined>;

const ignoreError = <F extends (...args: any) => Promise<AxiosResponse<Inner>>, Inner = Awaited<ReturnType<F>>["data"]>(
    func: F,
    ignoredErrorCodes: number[],
) => {
    return async (...args: Parameters<F>): OptionalAxiosPromise<Inner> => {
        try {
            const prop = await func(args);
            return prop;
        } catch (error) {
            if (isAxiosError(error) && ignoredErrorCodes.includes(error.response?.status ?? -1)) {
                return;
            }
            throw error;
        }
    };
};

type AxiosDiscordClient = ReturnType<typeof DefaultApiFactory>;
const buildRequestCaches = (client: AxiosDiscordClient) => {
    const guildCache = buildObjectCache(client.getGuild, 0, guild => guild.id);
    const channelCache = buildObjectCache(client.getChannel, 0, channel => channel.id);
    const userCache = buildObjectCache(client.getUser, 0, user => user.id);
    const messageCache = buildObjectCache(client.getMessage, 0, message => message.id);
    const roleCache = buildObjectCache(
        async (guildId: any, options: any[]) => ({
            roles: await client.listGuildRoles(guildId, options),
            guild: guildId,
        }),
        0,
        response,
    );

    return {
        guilds: guildCache,
        channels: channelCache,
        users: userCache,
        messages: messageCache,
    };
};

export const buildDiscordAPIClient = (applicationId: string, token: string) => {
    // @todo: lift the ratelimit implementation from here and replace it with one that obeys:
    // https://discord.com/developers/docs/topics/rate-limits
    const axiosClient = rateLimit(axios.create(), {
        maxRequests: 2,
        perMilliseconds: 5,
    });
    const api = DefaultApiFactory(
        {
            basePath: BaseUrl,
            baseOptions: { headers: { "Accept-Encoding": "gzip", Authorization: `Bot ${token}` } },
            isJsonMime: (mime: string) => mime.toLowerCase().includes("application/json"),
        },
        BaseUrl,
        axiosClient,
    );

    const caches = buildRequestCaches(api);

    return {
        commands: {
            global: {
                listAll: c(api.listApplicationCommands, applicationId),
                create: c(api.createApplicationCommand, applicationId),
                get: c(api.getApplicationCommand, applicationId),
                edit: c(api.updateApplicationCommand, applicationId),
                delete: c(api.deleteApplicationCommand, applicationId),
                overwriteAll: c(api.bulkSetApplicationCommands, applicationId),
            },
            guild: {
                get: caches.guilds.get,
                cache: caches.guilds,
                listAll: c(api.listGuildApplicationCommands, applicationId),
                create: c(api.createGuildApplicationCommand, applicationId),
                edit: c(api.updateGuildApplicationCommand, applicationId),
                delete: c(api.deleteApplicationCommand, applicationId),
                overwriteAll: c(api.bulkSetGuildApplicationCommands, applicationId),
            },
        },
        interactions: {
            response: {
                create: api.createInteractionResponse,
                // these list a "webhookId" as first parameter, this is substituted by applicationId
                // https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response
                getOriginal: c(api.getOriginalWebhookMessage, applicationId),
                editOriginal: c(api.updateOriginalWebhookMessage, applicationId),
                deleteOriginal: c(api.deleteOriginalWebhookMessage, applicationId),
            },
            followup: {
                // these list a "webhookId" as first parameter, this is substituted by applicationId
                // https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response
                create: c(api.executeWebhook, applicationId),
                get: c(api.getWebhookMessage, applicationId),
                edit: c(api.updateWebhookMessage, applicationId),
                delete: c(api.deleteWebhookMessage, applicationId),
            },
        },
        message: {
            get: caches.messages.get,
            cache: caches.messages,
            replyTo: (
                channelId: any,
                // to be a successful reply, the request has to reference a message
                messageCreateRequest: MessageCreateRequest & {
                    message_reference: Required<Pick<MessageCreateRequest, "message_reference">>;
                },
                options?: any,
            ) => {
                return api.createMessage(channelId, messageCreateRequest, options);
            },
            edit: api.updateMessage,
            delete: api.deleteMessage,
        },
        channel: {
            get: caches.channels.get,
            cache: caches.channels,
            edit: api.updateChannel,
            delete: api.deleteChannel,
            follow: api.followChannel,
        },
        guild: {
            get: caches.guilds.get,
            cache: caches.guilds,
            edit: api.updateGuild,
            delete: api.deleteGuild,
            getChannels: api.listGuildChannels,
            getMembers: api.listGuildMembers,
        },
        user: {
            get: caches.users.get,
            cache: caches.users,
            myself: {
                get: api.getMyUser,
                edit: api.updateMyUser,
            },
        },
        role: {
            getAll: api.listGuildRoles,
            create: api.createGuildRole,
            edit: api.updateGuildRole,
            delete: api.deleteGuildRole,
        },
    };
};
