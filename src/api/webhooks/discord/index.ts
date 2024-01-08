import { Environment } from "#/index";
import {
  APIBaseInteraction,
  APIWebhook,
  InteractionType,
} from "discord-api-types/v10";
import Elysia, { t } from "elysia";
import { loadDiscordConfig } from "./config";

// import nacl from "tweetnacl";
import nacl from "tweetnacl";
import { buildDiscordAPIClient } from "./apiClient";
import { loggerFactory } from "#/logging";
import { DiscordEnvironment, buildEventBus } from "./rabscuttle";
import { buildEightPepe } from "./commands/8pepe";
import { buildCycleCommands } from "./commands/administration";

const logger = loggerFactory("WEBHK: Discord");

export interface GatewayResultWithBody {
  body: unknown;
  status: 200;
}

export interface GatewayError {
  status: 400;
}

export type AnyGatewayResult = GatewayError | GatewayResultWithBody;

export type APIUnknownInteraction = APIBaseInteraction<InteractionType, unknown>;

type GatewayMessageResult = GatewayResultWithBody | GatewayError;
const buildDiscordEventBus = async (environment: DiscordEnvironment) => {
  const eventBus = buildEventBus();
  eventBus.register(await buildEightPepe(environment));
  eventBus.register(await buildCycleCommands(() => eventBus.plugins, environment));

  const handleWebhookMessage = async (body: APIUnknownInteraction): Promise<GatewayMessageResult> => {
    return eventBus.onNewInteraction(body, environment);
  };
  return handleWebhookMessage;
};

const RejectionError = t.Undefined();
const OkMessage = t.Unknown();

export default async <const Prefix extends string | undefined>(
  { prefix = "/webhooks/discord" }: { prefix: Prefix },
  environment: Environment,
) => {
  const config = await loadDiscordConfig();
  const { allowedApplicationIds, publicKey, applicationId, token } = config;
  const discordClient = buildDiscordAPIClient(applicationId, token);
  const discordEnvironment = {
    client: discordClient,
    ...environment,
    discord: { client: discordClient, config: config },
  };
  const handleWebhookMessage = await buildDiscordEventBus(discordEnvironment);

  return new Elysia({ prefix }).post(
    "/",
    async ({ body, set }) => {
      const probableBody = body as APIUnknownInteraction;

      if (!("application_id" in probableBody) || !probableBody.application_id) {
        logger.silly("Rejecting request, no 'application_id' in body");
        set.status = 401;
        return;
      }

      if (!allowedApplicationIds.includes(probableBody.application_id)) {
        logger.silly("Rejecting request, application_id is not in the list of allowed application ids");
        set.status = 401;
        return;
      }

      logger.debug(`Received message payload:\n${JSON.stringify(body, null, 2)}`);
      const result = await handleWebhookMessage(probableBody);
      logger.debug(`Responding with:\n${JSON.stringify(body, null, 2)}`);
      set.status = result.status;
      return "body" in result ? result.body : undefined;
    },
    {
      response: {
        400: RejectionError,
        401: RejectionError,
        200: OkMessage,
      },
      parse: async ctx => {
        const contentType = ctx.headers["content-type"];
        if (!contentType?.startsWith("application/json")) {
          logger.silly(`Rejecting Request, not of type 'application/json', was: '${contentType}'`);
          ctx.set.status = 401;
          return;
        }

        const signature = ctx.headers["x-signature-ed25519"];
        const timestamp = ctx.headers["x-signature-timestamp"];

        if (!signature || !timestamp) {
          logger.silly("Rejecting request, does not one or both of signature and timestamp");
          ctx.set.status = 401;
          return;
        }

        const requestText = await ctx.request.text();
        const isVerified = nacl.sign.detached.verify(
          Buffer.from(timestamp + requestText),
          Buffer.from(signature, "hex"),
          Buffer.from(publicKey, "hex"),
        );

        if (!isVerified) {
          logger.silly("Rejecting request, cannot verify signature");
          ctx.set.status = 401;
          return;
        }

        logger.silly("Passed all request checks, parsing body and executing handler");
        return JSON.parse(requestText) as APIWebhook;
      },
    },
  );
};
