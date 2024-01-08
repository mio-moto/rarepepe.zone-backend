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
import { ChannelFollowerWebhookResponseUser } from "./channel-follower-webhook-response-user";
// May contain unused imports in some cases
// @ts-ignore
import { GuildStickerResponseFormatType } from "./guild-sticker-response-format-type";
// May contain unused imports in some cases
// @ts-ignore
import { StickerTypes } from "./sticker-types";

/**
 *
 * @export
 * @interface GuildStickerResponse
 */
export interface GuildStickerResponse {
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  id: any;
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  name: any;
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  tags: any;
  /**
   *
   * @type {StickerTypes}
   * @memberof GuildStickerResponse
   */
  type: StickerTypes;
  /**
   *
   * @type {GuildStickerResponseFormatType}
   * @memberof GuildStickerResponse
   */
  format_type?: GuildStickerResponseFormatType;
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  description?: any;
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  available: any;
  /**
   *
   * @type {any}
   * @memberof GuildStickerResponse
   */
  guild_id: any;
  /**
   *
   * @type {ChannelFollowerWebhookResponseUser}
   * @memberof GuildStickerResponse
   */
  user?: ChannelFollowerWebhookResponseUser;
}
