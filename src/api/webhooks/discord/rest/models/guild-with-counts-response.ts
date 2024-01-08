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
import { AfkTimeouts } from "./afk-timeouts";
// May contain unused imports in some cases
// @ts-ignore
import { AvailableLocalesEnum } from "./available-locales-enum";
// May contain unused imports in some cases
// @ts-ignore
import { BasicMessageResponseApplicationId } from "./basic-message-response-application-id";
// May contain unused imports in some cases
// @ts-ignore
import { GuildExplicitContentFilterTypes } from "./guild-explicit-content-filter-types";
// May contain unused imports in some cases
// @ts-ignore
import { GuildMFALevel } from "./guild-mfalevel";
// May contain unused imports in some cases
// @ts-ignore
import { GuildNSFWContentLevel } from "./guild-nsfwcontent-level";
// May contain unused imports in some cases
// @ts-ignore
import { PremiumGuildTiers } from "./premium-guild-tiers";
// May contain unused imports in some cases
// @ts-ignore
import { UserNotificationSettings } from "./user-notification-settings";
// May contain unused imports in some cases
// @ts-ignore
import { VerificationLevels } from "./verification-levels";

/**
 *
 * @export
 * @interface GuildWithCountsResponse
 */
export interface GuildWithCountsResponse {
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  id: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  name: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  icon?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  description?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  home_header?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  splash?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  discovery_splash?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  features: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  banner?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  owner_id: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  application_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  region: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  afk_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {AfkTimeouts}
   * @memberof GuildWithCountsResponse
   */
  afk_timeout: AfkTimeouts | null;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  system_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  system_channel_flags: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  widget_enabled: any;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  widget_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {VerificationLevels}
   * @memberof GuildWithCountsResponse
   */
  verification_level: VerificationLevels;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  roles: any;
  /**
   *
   * @type {UserNotificationSettings}
   * @memberof GuildWithCountsResponse
   */
  default_message_notifications: UserNotificationSettings;
  /**
   *
   * @type {GuildMFALevel}
   * @memberof GuildWithCountsResponse
   */
  mfa_level: GuildMFALevel;
  /**
   *
   * @type {GuildExplicitContentFilterTypes}
   * @memberof GuildWithCountsResponse
   */
  explicit_content_filter: GuildExplicitContentFilterTypes;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  max_presences?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  max_members?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  max_stage_video_channel_users?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  max_video_channel_users?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  vanity_url_code?: any;
  /**
   *
   * @type {PremiumGuildTiers}
   * @memberof GuildWithCountsResponse
   */
  premium_tier: PremiumGuildTiers;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  premium_subscription_count: any;
  /**
   *
   * @type {AvailableLocalesEnum}
   * @memberof GuildWithCountsResponse
   */
  preferred_locale: AvailableLocalesEnum;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  rules_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  safety_alerts_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {BasicMessageResponseApplicationId}
   * @memberof GuildWithCountsResponse
   */
  public_updates_channel_id?: BasicMessageResponseApplicationId;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  premium_progress_bar_enabled: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  nsfw: any;
  /**
   *
   * @type {GuildNSFWContentLevel}
   * @memberof GuildWithCountsResponse
   */
  nsfw_level: GuildNSFWContentLevel;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  emojis: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  stickers: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  approximate_member_count?: any;
  /**
   *
   * @type {any}
   * @memberof GuildWithCountsResponse
   */
  approximate_presence_count?: any;
}
