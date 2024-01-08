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

/**
 * 
 * @export
 * @interface ReplyMessageReferenceRequest
 */
export interface ReplyMessageReferenceRequest {
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof ReplyMessageReferenceRequest
     */
    'guild_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof ReplyMessageReferenceRequest
     */
    'channel_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof ReplyMessageReferenceRequest
     */
    'message_id': any;
    /**
     * 
     * @type {any}
     * @memberof ReplyMessageReferenceRequest
     */
    'fail_if_not_exists'?: any;
}

