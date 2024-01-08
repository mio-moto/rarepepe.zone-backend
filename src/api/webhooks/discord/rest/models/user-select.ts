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
import { MessageComponentTypes } from "./message-component-types";

/**
 *
 * @export
 * @interface UserSelect
 */
export interface UserSelect {
  /**
   *
   * @type {MessageComponentTypes}
   * @memberof UserSelect
   */
  type: MessageComponentTypes;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  custom_id: any;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  placeholder?: any;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  min_values?: any;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  max_values?: any;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  disabled?: any;
  /**
   *
   * @type {any}
   * @memberof UserSelect
   */
  default_values?: any;
}
