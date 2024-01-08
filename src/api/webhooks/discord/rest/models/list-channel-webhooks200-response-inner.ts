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
import { ApplicationIncomingWebhookResponse } from "./application-incoming-webhook-response";
// May contain unused imports in some cases
// @ts-ignore
import { BasicMessageResponseApplicationId } from "./basic-message-response-application-id";
// May contain unused imports in some cases
// @ts-ignore
import { ChannelFollowerWebhookResponse } from "./channel-follower-webhook-response";
// May contain unused imports in some cases
// @ts-ignore
import { ChannelFollowerWebhookResponseSourceChannel } from "./channel-follower-webhook-response-source-channel";
// May contain unused imports in some cases
// @ts-ignore
import { ChannelFollowerWebhookResponseSourceGuild } from "./channel-follower-webhook-response-source-guild";
// May contain unused imports in some cases
// @ts-ignore
import { ChannelFollowerWebhookResponseUser } from "./channel-follower-webhook-response-user";
// May contain unused imports in some cases
// @ts-ignore
import { GuildIncomingWebhookResponse } from "./guild-incoming-webhook-response";
// May contain unused imports in some cases
// @ts-ignore
import { WebhookTypes } from "./webhook-types";

/**
 * @type ListChannelWebhooks200ResponseInner
 * @export
 */
export type ListChannelWebhooks200ResponseInner =
  | ApplicationIncomingWebhookResponse
  | ChannelFollowerWebhookResponse
  | GuildIncomingWebhookResponse;
