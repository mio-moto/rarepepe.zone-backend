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
 * @interface IncomingWebhookRequestPartial
 */
export interface IncomingWebhookRequestPartial {
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  content?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  embeds?: any;
  /**
   *
   * @type {BaseCreateMessageCreateRequestAllowedMentions}
   * @memberof IncomingWebhookRequestPartial
   */
  allowed_mentions?: BaseCreateMessageCreateRequestAllowedMentions;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  components?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  attachments?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  tts?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  flags?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  username?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  avatar_url?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  thread_name?: any;
  /**
   *
   * @type {any}
   * @memberof IncomingWebhookRequestPartial
   */
  applied_tags?: any;
}
