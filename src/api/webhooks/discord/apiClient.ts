import { loggerFactory } from "#/logging";
import { DefaultApiFactory } from "./rest";

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

export const buildDiscordAPIClient = (applicationId: string, token: string) => {
  const api = DefaultApiFactory(
    {
      basePath: BaseUrl,
      baseOptions: { headers: { "Accept-Encoding": "gzip", Authorization: `Bot ${token}` } },
      isJsonMime: (mime: string) => mime.toLowerCase().includes("application/json"),
    },
    BaseUrl,
  );

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
        listAll: c(api.listGuildApplicationCommands, applicationId),
        create: c(api.createGuildApplicationCommand, applicationId),
        get: c(api.getGuildApplicationCommand, applicationId),
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
  };
};
