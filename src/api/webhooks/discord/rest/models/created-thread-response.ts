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
import { ChannelTypes } from "./channel-types";
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildChannelRequestVideoQualityMode } from "./create-guild-channel-request-video-quality-mode";
// May contain unused imports in some cases
// @ts-ignore
import { CreatedThreadResponseMember } from "./created-thread-response-member";
// May contain unused imports in some cases
// @ts-ignore
import { CreatedThreadResponseThreadMetadata } from "./created-thread-response-thread-metadata";
// May contain unused imports in some cases
// @ts-ignore
import { UpdateSelfVoiceStateRequestChannelId } from "./update-self-voice-state-request-channel-id";

/**
 *
 * @export
 * @interface CreatedThreadResponse
 */
export interface CreatedThreadResponse {
  /**
   *
   * @type {any}
   * @memberof CreatedThreadResponse
   */
  id: any;
  /**
   *
   * @type {ChannelTypes}
   * @memberof CreatedThreadResponse
   */
  type: ChannelTypes;
  /**
   *
   * @type {UpdateSelfVoiceStateRequestChannelId}
   * @memberof CreatedThreadResponse
   */
  last_message_id?: UpdateSelfVoiceStateRequestChannelId | null;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  flags: number;
  /**
   *
   * @type {string}
   * @memberof CreatedThreadResponse
   */
  last_pin_timestamp?: string | null;
  /**
   *
   * @type {any}
   * @memberof CreatedThreadResponse
   */
  guild_id: any;
  /**
   *
   * @type {string}
   * @memberof CreatedThreadResponse
   */
  name: string | null;
  /**
   *
   * @type {UpdateSelfVoiceStateRequestChannelId}
   * @memberof CreatedThreadResponse
   */
  parent_id?: UpdateSelfVoiceStateRequestChannelId | null;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  rate_limit_per_user?: number | null;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  bitrate?: number | null;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  user_limit?: number | null;
  /**
   *
   * @type {string}
   * @memberof CreatedThreadResponse
   */
  rtc_region?: string | null;
  /**
   *
   * @type {CreateGuildChannelRequestVideoQualityMode}
   * @memberof CreatedThreadResponse
   */
  video_quality_mode?: CreateGuildChannelRequestVideoQualityMode;
  /**
   *
   * @type {string}
   * @memberof CreatedThreadResponse
   */
  permissions?: string | null;
  /**
   *
   * @type {any}
   * @memberof CreatedThreadResponse
   */
  owner_id: any;
  /**
   *
   * @type {CreatedThreadResponseThreadMetadata}
   * @memberof CreatedThreadResponse
   */
  thread_metadata?: CreatedThreadResponseThreadMetadata;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  message_count: number;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  member_count: number;
  /**
   *
   * @type {number}
   * @memberof CreatedThreadResponse
   */
  total_message_sent: number;
  /**
   *
   * @type {any}
   * @memberof CreatedThreadResponse
   */
  applied_tags?: any;
  /**
   *
   * @type {CreatedThreadResponseMember}
   * @memberof CreatedThreadResponse
   */
  member?: CreatedThreadResponseMember;
}
