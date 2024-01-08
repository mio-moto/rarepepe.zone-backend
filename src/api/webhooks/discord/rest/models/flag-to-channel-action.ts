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
import { AutomodActionType } from "./automod-action-type";
// May contain unused imports in some cases
// @ts-ignore
import { FlagToChannelActionMetadata } from "./flag-to-channel-action-metadata";

/**
 *
 * @export
 * @interface FlagToChannelAction
 */
export interface FlagToChannelAction {
  /**
   *
   * @type {AutomodActionType}
   * @memberof FlagToChannelAction
   */
  type: AutomodActionType;
  /**
   *
   * @type {FlagToChannelActionMetadata}
   * @memberof FlagToChannelAction
   */
  metadata: FlagToChannelActionMetadata;
}
