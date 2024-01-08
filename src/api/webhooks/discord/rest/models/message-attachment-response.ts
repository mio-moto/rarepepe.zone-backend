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
import { MessageAttachmentResponseApplication } from './message-attachment-response-application';

/**
 * 
 * @export
 * @interface MessageAttachmentResponse
 */
export interface MessageAttachmentResponse {
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'id': any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'filename': any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'size': any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'url': any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'proxy_url': any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'width'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'height'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'duration_secs'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'waveform'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'description'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'content_type'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'ephemeral'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'title'?: any;
    /**
     * 
     * @type {MessageAttachmentResponseApplication}
     * @memberof MessageAttachmentResponse
     */
    'application'?: MessageAttachmentResponseApplication;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'clip_created_at'?: any;
    /**
     * 
     * @type {any}
     * @memberof MessageAttachmentResponse
     */
    'clip_participants'?: any;
}

