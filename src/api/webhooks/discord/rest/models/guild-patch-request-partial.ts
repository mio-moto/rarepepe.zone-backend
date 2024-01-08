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
import { BasicMessageResponseApplicationId } from './basic-message-response-application-id';
// May contain unused imports in some cases
// @ts-ignore
import { GuildCreateRequestAfkTimeout } from './guild-create-request-afk-timeout';
// May contain unused imports in some cases
// @ts-ignore
import { GuildCreateRequestDefaultMessageNotifications } from './guild-create-request-default-message-notifications';
// May contain unused imports in some cases
// @ts-ignore
import { GuildCreateRequestExplicitContentFilter } from './guild-create-request-explicit-content-filter';
// May contain unused imports in some cases
// @ts-ignore
import { GuildCreateRequestPreferredLocale } from './guild-create-request-preferred-locale';
// May contain unused imports in some cases
// @ts-ignore
import { GuildCreateRequestVerificationLevel } from './guild-create-request-verification-level';

/**
 * 
 * @export
 * @interface GuildPatchRequestPartial
 */
export interface GuildPatchRequestPartial {
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'name'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'description'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'region'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'icon'?: any;
    /**
     * 
     * @type {GuildCreateRequestVerificationLevel}
     * @memberof GuildPatchRequestPartial
     */
    'verification_level'?: GuildCreateRequestVerificationLevel;
    /**
     * 
     * @type {GuildCreateRequestDefaultMessageNotifications}
     * @memberof GuildPatchRequestPartial
     */
    'default_message_notifications'?: GuildCreateRequestDefaultMessageNotifications;
    /**
     * 
     * @type {GuildCreateRequestExplicitContentFilter}
     * @memberof GuildPatchRequestPartial
     */
    'explicit_content_filter'?: GuildCreateRequestExplicitContentFilter;
    /**
     * 
     * @type {GuildCreateRequestPreferredLocale}
     * @memberof GuildPatchRequestPartial
     */
    'preferred_locale'?: GuildCreateRequestPreferredLocale;
    /**
     * 
     * @type {GuildCreateRequestAfkTimeout}
     * @memberof GuildPatchRequestPartial
     */
    'afk_timeout'?: GuildCreateRequestAfkTimeout;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildPatchRequestPartial
     */
    'afk_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildPatchRequestPartial
     */
    'system_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'owner_id'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'splash'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'banner'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'system_channel_flags'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'features'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'discovery_splash'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'home_header'?: any;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildPatchRequestPartial
     */
    'rules_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildPatchRequestPartial
     */
    'safety_alerts_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildPatchRequestPartial
     */
    'public_updates_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof GuildPatchRequestPartial
     */
    'premium_progress_bar_enabled'?: any;
}
