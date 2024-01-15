import { Environment } from "#/index";
import Elysia, { t } from "elysia";
import { loadDiscordConfig } from "./config";
import nacl from "tweetnacl";
import { buildDiscordAPIClient } from "./clients/apiClient";
import { loggerFactory } from "#/logging";
import { DiscordEnvironment, buildEventBus } from "./rabscuttle";
import { buildEightPepe } from "./commands/8pepe";
import { buildCycleCommands } from "./commands/administration";
import { buildMessageParser } from "./messageParser";
import { camelize, snakelize } from "@discordeno/utils";
import { Interaction } from "./types";

const logger = loggerFactory("WEBHK:Discord:Request");

export interface GatewayResultWithBody {
    body: unknown;
    status: 200;
}

export interface GatewayError {
    status: 400;
}

export type AnyGatewayResult = GatewayError | GatewayResultWithBody;

type GatewayMessageResult = GatewayResultWithBody | GatewayError;
const buildDiscordEventBus = async (environment: DiscordEnvironment) => {
    const eventBus = buildEventBus();
    const { eightPepePlugin, pepeThisPlugin } = await buildEightPepe(environment);
    eventBus.register(eightPepePlugin);
    eventBus.register(pepeThisPlugin);
    eventBus.register(await buildCycleCommands(() => eventBus.plugins, environment));

    const handleWebhookMessage = async (body: Interaction): Promise<GatewayMessageResult> => {
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
    const messageParser = buildMessageParser(discordClient);

    const discordEnvironment: DiscordEnvironment = {
        ...environment,
        discord: { client: discordClient, config: config, messageParser: messageParser },
    };
    const handleWebhookMessage = await buildDiscordEventBus(discordEnvironment);

    return new Elysia({ prefix }).post(
        "/",
        async ({ body, set }) => {
            const probableBody = body as Interaction;

            if (!probableBody.applicationId) {
                logger.silly("Rejecting request, no 'application_id' in body");
                set.status = 401;
                return;
            }

            if (!allowedApplicationIds.includes(probableBody.applicationId)) {
                logger.silly("Rejecting request, application_id is not in the list of allowed application ids");
                set.status = 401;
                return;
            }

            logger.debug(`Received message payload:\n${JSON.stringify(body)}`);
            const result = await handleWebhookMessage(probableBody);
            if (result.status === 400) {
                return;
            }
            const snaked = snakelize(result.body);
            logger.debug(`Responding with:\n${JSON.stringify(snaked)}`);
            set.status = result.status;
            return snaked;
        },
        {
            response: {
                400: RejectionError,
                401: RejectionError,
                200: OkMessage,
            },
            parse: async ctx => {
                const headers = ctx.request.headers;
                const contentType = headers.get("content-type");
                if (!contentType?.startsWith("application/json")) {
                    logger.silly(`Rejecting Request, not of type 'application/json', was: '${contentType}'`);
                    ctx.set.status = 401;
                    return;
                }

                const signature = headers.get("x-signature-ed25519");
                const timestamp = headers.get("x-signature-timestamp");
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
                return camelize(JSON.parse(requestText)) as Interaction;
            },
        },
    );
};
