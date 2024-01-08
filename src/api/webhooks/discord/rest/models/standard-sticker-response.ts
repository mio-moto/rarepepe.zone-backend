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
import { GuildStickerResponseFormatType } from "./guild-sticker-response-format-type";
// May contain unused imports in some cases
// @ts-ignore
import { StickerTypes } from "./sticker-types";

/**
 *
 * @export
 * @interface StandardStickerResponse
 */
export interface StandardStickerResponse {
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  id: any;
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  name: any;
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  tags: any;
  /**
   *
   * @type {StickerTypes}
   * @memberof StandardStickerResponse
   */
  type: StickerTypes;
  /**
   *
   * @type {GuildStickerResponseFormatType}
   * @memberof StandardStickerResponse
   */
  format_type?: GuildStickerResponseFormatType;
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  description?: any;
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  pack_id: any;
  /**
   *
   * @type {any}
   * @memberof StandardStickerResponse
   */
  sort_value: any;
}
