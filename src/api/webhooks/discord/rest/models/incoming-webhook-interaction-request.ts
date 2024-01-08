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
import { BaseCreateMessageCreateRequestAllowedMentions } from "./base-create-message-create-request-allowed-mentions";

/**
 *
 * @export
 * @interface IncomingWebhookInteractionRequest
 */
export interface IncomingWebhookInteractionRequest {
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  content?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  embeds?: any;
  /**
   *
   * @type {BaseCreateMessageCreateRequestAllowedMentions}
   * @memberof IncomingWebhookInteractionRequest
   */
  allowed_mentions?: BaseCreateMessageCreateRequestAllowedMentions;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  components?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  attachments?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  tts?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookInteractionRequest
   */
  flags?: any;
}
