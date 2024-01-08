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



/**
 * 
 * @export
 * @interface ApplicationCommandOptionStringChoiceResponse
 */
export interface ApplicationCommandOptionStringChoiceResponse {
    /**
     * 
     * @type {string}
     * @memberof ApplicationCommandOptionStringChoiceResponse
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof ApplicationCommandOptionStringChoiceResponse
     */
    'name_localized'?: string | null;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof ApplicationCommandOptionStringChoiceResponse
     */
    'name_localizations'?: { [key: string]: string; };
    /**
     * 
     * @type {string}
     * @memberof ApplicationCommandOptionStringChoiceResponse
     */
    'value': string;
}

