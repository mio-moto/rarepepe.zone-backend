/* tslint:disable */
/* eslint-disable */
/**
 * Discord HTTP API (Preview)
 * Preview of the Discord v10 HTTP API specification. See https://discord.com/developers/docs for more details.
 *
 * The version of the OpenAPI document: 10
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

// May contain unused imports in some cases
// @ts-ignore
import { BasicMessageResponseApplicationId } from "./basic-message-response-application-id";
// May contain unused imports in some cases
// @ts-ignore
import { DiscordIntegrationResponse } from "./discord-integration-response";
// May contain unused imports in some cases
// @ts-ignore
import { DiscordIntegrationResponseAccount } from "./discord-integration-response-account";
// May contain unused imports in some cases
// @ts-ignore
import { ExternalConnectionIntegrationResponse } from "./external-connection-integration-response";
// May contain unused imports in some cases
// @ts-ignore
import { ExternalConnectionIntegrationResponseExpireBehavior } from "./external-connection-integration-response-expire-behavior";
// May contain unused imports in some cases
// @ts-ignore
import { ExternalConnectionIntegrationResponseExpireGracePeriod } from "./external-connection-integration-response-expire-grace-period";
// May contain unused imports in some cases
// @ts-ignore
import { GuildSubscriptionIntegrationResponse } from "./guild-subscription-integration-response";
// May contain unused imports in some cases
// @ts-ignore
import { IntegrationApplicationResponse } from "./integration-application-response";
// May contain unused imports in some cases
// @ts-ignore
import { IntegrationTypes } from "./integration-types";
// May contain unused imports in some cases
// @ts-ignore
import { UserResponse } from "./user-response";

/**
 * @type ListGuildIntegrations200ResponseInner
 * @export
 */
export type ListGuildIntegrations200ResponseInner =
  | DiscordIntegrationResponse
  | ExternalConnectionIntegrationResponse
  | GuildSubscriptionIntegrationResponse;
