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
import { EntityMetadataExternal } from './entity-metadata-external';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventEntityTypes } from './guild-scheduled-event-entity-types';
// May contain unused imports in some cases
// @ts-ignore
import { GuildScheduledEventPrivacyLevels } from './guild-scheduled-event-privacy-levels';

/**
 * 
 * @export
 * @interface ExternalScheduledEventCreateRequest
 */
export interface ExternalScheduledEventCreateRequest {
    /**
     * 
     * @type {any}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'description'?: any;
    /**
     * 
     * @type {any}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'image'?: any;
    /**
     * 
     * @type {any}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'scheduled_start_time': any;
    /**
     * 
     * @type {any}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'scheduled_end_time'?: any;
    /**
     * 
     * @type {GuildScheduledEventPrivacyLevels}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'privacy_level': GuildScheduledEventPrivacyLevels;
    /**
     * 
     * @type {GuildScheduledEventEntityTypes}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'entity_type': GuildScheduledEventEntityTypes;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {EntityMetadataExternal}
     * @memberof ExternalScheduledEventCreateRequest
     */
    'entity_metadata': EntityMetadataExternal;
}

