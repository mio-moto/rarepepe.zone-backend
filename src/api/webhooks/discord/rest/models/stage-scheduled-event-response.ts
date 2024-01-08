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
import { StageScheduledEventResponseEntityMetadata } from './stage-scheduled-event-response-entity-metadata';

/**
 * 
 * @export
 * @interface StageScheduledEventResponse
 */
export interface StageScheduledEventResponse {
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'id': any;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'guild_id': any;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'description'?: any;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof StageScheduledEventResponse
     */
    'channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof StageScheduledEventResponse
     */
    'creator_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {ChannelFollowerWebhookResponseUser}
     * @memberof StageScheduledEventResponse
     */
    'creator'?: ChannelFollowerWebhookResponseUser;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'image'?: any;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'scheduled_start_time': any;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'scheduled_end_time'?: any;
    /**
     * 
     * @type {GuildScheduledEventStatuses}
     * @memberof StageScheduledEventResponse
     */
    'status': GuildScheduledEventStatuses;
    /**
     * 
     * @type {GuildScheduledEventEntityTypes}
     * @memberof StageScheduledEventResponse
     */
    'entity_type': GuildScheduledEventEntityTypes;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof StageScheduledEventResponse
     */
    'entity_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof StageScheduledEventResponse
     */
    'user_count'?: any;
    /**
     * 
     * @type {GuildScheduledEventPrivacyLevels}
     * @memberof StageScheduledEventResponse
     */
    'privacy_level': GuildScheduledEventPrivacyLevels;
    /**
     * 
     * @type {ExternalScheduledEventResponseUserRsvp}
     * @memberof StageScheduledEventResponse
     */
    'user_rsvp'?: ExternalScheduledEventResponseUserRsvp;
    /**
     * 
     * @type {StageScheduledEventResponseEntityMetadata}
     * @memberof StageScheduledEventResponse
     */
    'entity_metadata'?: StageScheduledEventResponseEntityMetadata;
}

