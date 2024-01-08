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
import { AutomodEventType } from './automod-event-type';
// May contain unused imports in some cases
// @ts-ignore
import { AutomodTriggerType } from './automod-trigger-type';
// May contain unused imports in some cases
// @ts-ignore
import { DefaultKeywordListUpsertRequestPartial } from './default-keyword-list-upsert-request-partial';
// May contain unused imports in some cases
// @ts-ignore
import { KeywordUpsertRequestPartial } from './keyword-upsert-request-partial';
// May contain unused imports in some cases
// @ts-ignore
import { MLSpamUpsertRequestPartial } from './mlspam-upsert-request-partial';
// May contain unused imports in some cases
// @ts-ignore
import { MentionSpamUpsertRequestPartial } from './mention-spam-upsert-request-partial';
// May contain unused imports in some cases
// @ts-ignore
import { MentionSpamUpsertRequestTriggerMetadata } from './mention-spam-upsert-request-trigger-metadata';

/**
 * 
 * @export
 * @interface UpdateAutoModerationRuleRequest
 */
export interface UpdateAutoModerationRuleRequest {
    /**
     * 
     * @type {any}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'name'?: any;
    /**
     * 
     * @type {AutomodEventType}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'event_type'?: AutomodEventType;
    /**
     * 
     * @type {any}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'actions'?: any;
    /**
     * 
     * @type {any}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'enabled'?: any;
    /**
     * 
     * @type {any}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'exempt_roles'?: any;
    /**
     * 
     * @type {any}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'exempt_channels'?: any;
    /**
     * 
     * @type {AutomodTriggerType}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'trigger_type'?: AutomodTriggerType;
    /**
     * 
     * @type {MentionSpamUpsertRequestTriggerMetadata}
     * @memberof UpdateAutoModerationRuleRequest
     */
    'trigger_metadata'?: MentionSpamUpsertRequestTriggerMetadata;
}

