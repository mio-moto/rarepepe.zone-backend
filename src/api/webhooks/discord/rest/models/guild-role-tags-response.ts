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

/**
 *
 * @export
 * @interface GuildRoleTagsResponse
 */
export interface GuildRoleTagsResponse {
  /**
   *
   * @type {any}
   * @memberof GuildRoleTagsResponse
   */
  premium_subscriber?: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildRoleTagsResponse
   */
  bot_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildRoleTagsResponse
   */
  integration_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildRoleTagsResponse
   */
  subscription_listing_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof GuildRoleTagsResponse
   */
  available_for_purchase?: any;
  /**
   *
   * @type {any}
   * @memberof GuildRoleTagsResponse
   */
  guild_connections?: any;
}
