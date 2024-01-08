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
import { AutomodEventType } from "./automod-event-type";
// May contain unused imports in some cases
// @ts-ignore
import { AutomodTriggerType } from "./automod-trigger-type";
// May contain unused imports in some cases
// @ts-ignore
import { MentionSpamUpsertRequestTriggerMetadata } from "./mention-spam-upsert-request-trigger-metadata";

/**
 *
 * @export
 * @interface MentionSpamUpsertRequestPartial
 */
export interface MentionSpamUpsertRequestPartial {
  /**
   *
   * @type {any}
   * @memberof MentionSpamUpsertRequestPartial
   */
  name?: any;
  /**
   *
   * @type {AutomodEventType}
   * @memberof MentionSpamUpsertRequestPartial
   */
  event_type?: AutomodEventType;
  /**
   *
   * @type {any}
   * @memberof MentionSpamUpsertRequestPartial
   */
  actions?: any;
  /**
   *
   * @type {any}
   * @memberof MentionSpamUpsertRequestPartial
   */
  enabled?: any;
  /**
   *
   * @type {any}
   * @memberof MentionSpamUpsertRequestPartial
   */
  exempt_roles?: any;
  /**
   *
   * @type {any}
   * @memberof MentionSpamUpsertRequestPartial
   */
  exempt_channels?: any;
  /**
   *
   * @type {AutomodTriggerType}
   * @memberof MentionSpamUpsertRequestPartial
   */
  trigger_type?: AutomodTriggerType;
  /**
   *
   * @type {MentionSpamUpsertRequestTriggerMetadata}
   * @memberof MentionSpamUpsertRequestPartial
   */
  trigger_metadata?: MentionSpamUpsertRequestTriggerMetadata;
}
