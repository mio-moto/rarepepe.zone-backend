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
import { AfkTimeouts } from './afk-timeouts';
// May contain unused imports in some cases
// @ts-ignore
import { AvailableLocalesEnum } from './available-locales-enum';
// May contain unused imports in some cases
// @ts-ignore
import { BasicMessageResponseApplicationId } from './basic-message-response-application-id';
// May contain unused imports in some cases
// @ts-ignore
import { GuildExplicitContentFilterTypes } from './guild-explicit-content-filter-types';
// May contain unused imports in some cases
// @ts-ignore
import { UserNotificationSettings } from './user-notification-settings';
// May contain unused imports in some cases
// @ts-ignore
import { VerificationLevels } from './verification-levels';

/**
 * 
 * @export
 * @interface GuildTemplateSnapshotResponse
 */
export interface GuildTemplateSnapshotResponse {
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'description'?: any;
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'region'?: any;
    /**
     * 
     * @type {VerificationLevels}
     * @memberof GuildTemplateSnapshotResponse
     */
    'verification_level': VerificationLevels;
    /**
     * 
     * @type {UserNotificationSettings}
     * @memberof GuildTemplateSnapshotResponse
     */
    'default_message_notifications': UserNotificationSettings;
    /**
     * 
     * @type {GuildExplicitContentFilterTypes}
     * @memberof GuildTemplateSnapshotResponse
     */
    'explicit_content_filter': GuildExplicitContentFilterTypes;
    /**
     * 
     * @type {AvailableLocalesEnum}
     * @memberof GuildTemplateSnapshotResponse
     */
    'preferred_locale': AvailableLocalesEnum;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildTemplateSnapshotResponse
     */
    'afk_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {AfkTimeouts}
     * @memberof GuildTemplateSnapshotResponse
     */
    'afk_timeout': AfkTimeouts | null;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof GuildTemplateSnapshotResponse
     */
    'system_channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'system_channel_flags': any;
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'roles': any;
    /**
     * 
     * @type {any}
     * @memberof GuildTemplateSnapshotResponse
     */
    'channels': any;
}

