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
// May contain unused imports in some cases
// @ts-ignore
import { CreateForumThreadRequestAutoArchiveDuration } from "./create-forum-thread-request-auto-archive-duration";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildChannelRequestDefaultForumLayout } from "./create-guild-channel-request-default-forum-layout";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildChannelRequestDefaultReactionEmoji } from "./create-guild-channel-request-default-reaction-emoji";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildChannelRequestDefaultSortOrder } from "./create-guild-channel-request-default-sort-order";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildChannelRequestVideoQualityMode } from "./create-guild-channel-request-video-quality-mode";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildRequestChannelItemType } from "./create-guild-request-channel-item-type";

/**
 *
 * @export
 * @interface CreateGuildRequestChannelItem
 */
export interface CreateGuildRequestChannelItem {
  /**
   *
   * @type {CreateGuildRequestChannelItemType}
   * @memberof CreateGuildRequestChannelItem
   */
  type?: CreateGuildRequestChannelItemType;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  name: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  position?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  topic?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  bitrate?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  user_limit?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  nsfw?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  rate_limit_per_user?: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof CreateGuildRequestChannelItem
   */
  parent_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  permission_overwrites?: any;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  rtc_region?: any;
  /**
   *
   * @type {CreateGuildChannelRequestVideoQualityMode}
   * @memberof CreateGuildRequestChannelItem
   */
  video_quality_mode?: CreateGuildChannelRequestVideoQualityMode;
  /**
   *
   * @type {CreateForumThreadRequestAutoArchiveDuration}
   * @memberof CreateGuildRequestChannelItem
   */
  default_auto_archive_duration?: CreateForumThreadRequestAutoArchiveDuration;
  /**
   *
   * @type {CreateGuildChannelRequestDefaultReactionEmoji}
   * @memberof CreateGuildRequestChannelItem
   */
  default_reaction_emoji?: CreateGuildChannelRequestDefaultReactionEmoji;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  default_thread_rate_limit_per_user?: any;
  /**
   *
   * @type {CreateGuildChannelRequestDefaultSortOrder}
   * @memberof CreateGuildRequestChannelItem
   */
  default_sort_order?: CreateGuildChannelRequestDefaultSortOrder;
  /**
   *
   * @type {CreateGuildChannelRequestDefaultForumLayout}
   * @memberof CreateGuildRequestChannelItem
   */
  default_forum_layout?: CreateGuildChannelRequestDefaultForumLayout;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof CreateGuildRequestChannelItem
   */
  id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof CreateGuildRequestChannelItem
   */
  available_tags?: any;
}
