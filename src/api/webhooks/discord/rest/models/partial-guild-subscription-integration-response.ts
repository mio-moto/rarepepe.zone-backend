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
import { DiscordIntegrationResponseAccount } from "./discord-integration-response-account";
// May contain unused imports in some cases
// @ts-ignore
import { IntegrationTypes } from "./integration-types";

/**
 *
 * @export
 * @interface PartialGuildSubscriptionIntegrationResponse
 */
export interface PartialGuildSubscriptionIntegrationResponse {
  /**
   *
   * @type {any}
   * @memberof PartialGuildSubscriptionIntegrationResponse
   */
  id: any;
  /**
   *
   * @type {IntegrationTypes}
   * @memberof PartialGuildSubscriptionIntegrationResponse
   */
  type: IntegrationTypes;
  /**
   *
   * @type {any}
   * @memberof PartialGuildSubscriptionIntegrationResponse
   */
  name?: any;
  /**
   *
   * @type {DiscordIntegrationResponseAccount}
   * @memberof PartialGuildSubscriptionIntegrationResponse
   */
  account?: DiscordIntegrationResponseAccount;
}
