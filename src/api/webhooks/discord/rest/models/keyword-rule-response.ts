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
import { KeywordTriggerMetadataResponse } from "./keyword-trigger-metadata-response";

/**
 *
 * @export
 * @interface KeywordRuleResponse
 */
export interface KeywordRuleResponse {
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  id: any;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  guild_id: any;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  creator_id: any;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  name: any;
  /**
   *
   * @type {AutomodEventType}
   * @memberof KeywordRuleResponse
   */
  event_type: AutomodEventType;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  actions: any;
  /**
   *
   * @type {AutomodTriggerType}
   * @memberof KeywordRuleResponse
   */
  trigger_type: AutomodTriggerType;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  enabled?: any;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  exempt_roles?: any;
  /**
   *
   * @type {any}
   * @memberof KeywordRuleResponse
   */
  exempt_channels?: any;
  /**
   *
   * @type {KeywordTriggerMetadataResponse}
   * @memberof KeywordRuleResponse
   */
  trigger_metadata: KeywordTriggerMetadataResponse;
}
