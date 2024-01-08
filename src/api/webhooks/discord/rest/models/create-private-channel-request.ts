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
 * @interface CreatePrivateChannelRequest
 */
export interface CreatePrivateChannelRequest {
    /**
     * 
     * @type {BasicMessageResponseApplicationId}
     * @memberof CreatePrivateChannelRequest
     */
    'recipient_id'?: BasicMessageResponseApplicationId;
    /**
     * 
     * @type {any}
     * @memberof CreatePrivateChannelRequest
     */
    'access_tokens'?: any;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof CreatePrivateChannelRequest
     */
    'nicks'?: { [key: string]: any; };
}

