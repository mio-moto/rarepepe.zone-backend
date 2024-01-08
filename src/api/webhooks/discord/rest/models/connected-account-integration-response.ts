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
import { AccountResponse } from "./account-response";
// May contain unused imports in some cases
// @ts-ignore
import { ConnectedAccountGuildResponse } from "./connected-account-guild-response";
// May contain unused imports in some cases
// @ts-ignore
import { IntegrationTypes } from "./integration-types";

/**
 *
 * @export
 * @interface ConnectedAccountIntegrationResponse
 */
export interface ConnectedAccountIntegrationResponse {
  /**
   *
   * @type {any}
   * @memberof ConnectedAccountIntegrationResponse
   */
  id: any;
  /**
   *
   * @type {IntegrationTypes}
   * @memberof ConnectedAccountIntegrationResponse
   */
  type: IntegrationTypes;
  /**
   *
   * @type {AccountResponse}
   * @memberof ConnectedAccountIntegrationResponse
   */
  account: AccountResponse;
  /**
   *
   * @type {ConnectedAccountGuildResponse}
   * @memberof ConnectedAccountIntegrationResponse
   */
  guild: ConnectedAccountGuildResponse;
}
