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
import { CreateGroupDMInviteRequest } from './create-group-dminvite-request';
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildInviteRequest } from './create-guild-invite-request';
// May contain unused imports in some cases
// @ts-ignore
import { CreateGuildInviteRequestTargetType } from './create-guild-invite-request-target-type';

/**
 * 
 * @export
 * @interface CreateChannelInviteRequest
 */
export interface CreateChannelInviteRequest {
    /**
     * 
     * @type {any}
     * @memberof CreateChannelInviteRequest
     */
    'max_age'?: any;
    /**
     * 
     * @type {any}
     * @memberof CreateChannelInviteRequest
     */
    'temporary'?: any;
    /**
     * 
     * @type {any}
     * @memberof CreateChannelInviteRequest
     */
    'max_uses'?: any;
    /**
     * 
     * @type {any}
     * @memberof CreateChannelInviteRequest
     */
    'unique'?: any;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof CreateChannelInviteRequest
     */
    'target_user_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof CreateChannelInviteRequest
     */
    'target_application_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {CreateGuildInviteRequestTargetType}
     * @memberof CreateChannelInviteRequest
     */
    'target_type'?: CreateGuildInviteRequestTargetType;
}

