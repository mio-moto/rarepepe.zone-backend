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
import { ApplicationCommandOptionType } from "./application-command-option-type";
// May contain unused imports in some cases
// @ts-ignore
import { ChannelTypes } from "./channel-types";

/**
 *
 * @export
 * @interface ApplicationCommandChannelOptionResponse
 */
export interface ApplicationCommandChannelOptionResponse {
  /**
   *
   * @type {ApplicationCommandOptionType}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  type: ApplicationCommandOptionType | null;
  /**
   *
   * @type {string}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  name_localized?: string | null;
  /**
   *
   * @type {{ [key: string]: string; }}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  name_localizations?: { [key: string]: string };
  /**
   *
   * @type {string}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  description: string;
  /**
   *
   * @type {string}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  description_localized?: string | null;
  /**
   *
   * @type {{ [key: string]: string; }}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  description_localizations?: { [key: string]: string };
  /**
   *
   * @type {boolean}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  required?: boolean | null;
  /**
   *
   * @type {Array<ChannelTypes>}
   * @memberof ApplicationCommandChannelOptionResponse
   */
  channel_types?: Array<ChannelTypes>;
}
