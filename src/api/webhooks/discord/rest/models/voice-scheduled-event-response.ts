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
import { ChannelFollowerWebhookResponseUser } from './channel-follower-webhook-response-user';
// May contain unused imports in some cases
// @ts-ignore
import { ExternalScheduledEventResponseUserRsvp } from './external-scheduled-event-response-user-rsvp';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventEntityTypes } from './guild-scheduled-event-entity-types';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventPrivacyLevels } from './guild-scheduled-event-privacy-levels';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventStatuses } from './guild-scheduled-event-statuses';
// May contain unused imports in some cases
// @ts-ignore
import { VoiceScheduledEventResponseEntityMetadata } from './voice-scheduled-event-response-entity-metadata';

/**
 * 
 * @export
 * @interface VoiceScheduledEventResponse
 */
export interface VoiceScheduledEventResponse {
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'id': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'guild_id': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'description'?: any;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof VoiceScheduledEventResponse
     */
    'channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof VoiceScheduledEventResponse
     */
    'creator_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {ChannelFollowerWebhookResponseUser}
     * @memberof VoiceScheduledEventResponse
     */
    'creator'?: ChannelFollowerWebhookResponseUser;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'image'?: any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'scheduled_start_time': any;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'scheduled_end_time'?: any;
    /**
     * 
     * @type {GuildScheduledEventStatuses}
     * @memberof VoiceScheduledEventResponse
     */
    'status': GuildScheduledEventStatuses;
    /**
     * 
     * @type {GuildScheduledEventEntityTypes}
     * @memberof VoiceScheduledEventResponse
     */
    'entity_type': GuildScheduledEventEntityTypes;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof VoiceScheduledEventResponse
     */
    'entity_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof VoiceScheduledEventResponse
     */
    'user_count'?: any;
    /**
     * 
     * @type {GuildScheduledEventPrivacyLevels}
     * @memberof VoiceScheduledEventResponse
     */
    'privacy_level': GuildScheduledEventPrivacyLevels;
    /**
     * 
     * @type {ExternalScheduledEventResponseUserRsvp}
     * @memberof VoiceScheduledEventResponse
     */
    'user_rsvp'?: ExternalScheduledEventResponseUserRsvp;
    /**
     * 
     * @type {VoiceScheduledEventResponseEntityMetadata}
     * @memberof VoiceScheduledEventResponse
     */
    'entity_metadata'?: VoiceScheduledEventResponseEntityMetadata;
}

