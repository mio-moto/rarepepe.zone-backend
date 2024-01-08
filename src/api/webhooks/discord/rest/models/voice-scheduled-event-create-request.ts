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
import { GuildScheduledEventEntityTypes } from './guild-scheduled-event-entity-types';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventPrivacyLevels } from './guild-scheduled-event-privacy-levels';
// May contain unused imports in some cases
// @ts-ignore
import { VoiceScheduledEventCreateRequestEntityMetadata } from './voice-scheduled-event-create-request-entity-metadata';

/**
 * 
 * @export
 * @interface VoiceScheduledEventCreateRequest
 */
export interface VoiceScheduledEventCreateRequest {
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'description'?: any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'image'?: any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'scheduled_start_time': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'scheduled_end_time'?: any;
    /**
     * 
     * @type {GuildScheduledEventPrivacyLevels}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'privacy_level': GuildScheduledEventPrivacyLevels;
    /**
     * 
     * @type {GuildScheduledEventEntityTypes}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'entity_type': GuildScheduledEventEntityTypes;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {VoiceScheduledEventCreateRequestEntityMetadata}
     * @memberof VoiceScheduledEventCreateRequest
     */
    'entity_metadata'?: VoiceScheduledEventCreateRequestEntityMetadata;
}

