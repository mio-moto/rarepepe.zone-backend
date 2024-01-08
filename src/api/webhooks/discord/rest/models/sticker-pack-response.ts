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
 * @interface StickerPackResponse
 */
export interface StickerPackResponse {
  /**
   *
   * @type {any}
   * @memberof StickerPackResponse
   */
  id: any;
  /**
   *
   * @type {any}
   * @memberof StickerPackResponse
   */
  sku_id: any;
  /**
   *
   * @type {any}
   * @memberof StickerPackResponse
   */
  name: any;
  /**
   *
   * @type {any}
   * @memberof StickerPackResponse
   */
  description?: any;
  /**
   *
   * @type {any}
   * @memberof StickerPackResponse
   */
  stickers: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof StickerPackResponse
   */
  cover_sticker_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof StickerPackResponse
   */
  banner_asset_id?: BasicMessageResponseApplicationId;
}
