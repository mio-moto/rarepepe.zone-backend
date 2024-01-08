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

/**
 *
 * @export
 * @interface UpdateApplicationUserRoleConnectionRequest
 */
export interface UpdateApplicationUserRoleConnectionRequest {
  /**
   *
   * @type {string}
   * @memberof UpdateApplicationUserRoleConnectionRequest
   */
  platform_name?: string | null;
  /**
   *
   * @type {string}
   * @memberof UpdateApplicationUserRoleConnectionRequest
   */
  platform_username?: string | null;
  /**
   *
   * @type {{ [key: string]: string; }}
   * @memberof UpdateApplicationUserRoleConnectionRequest
   */
  metadata?: { [key: string]: string };
}
