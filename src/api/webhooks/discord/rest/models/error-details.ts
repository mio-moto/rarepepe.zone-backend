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
import { ErrorDetails } from "./error-details";
// May contain unused imports in some cases
// @ts-ignore
import { InnerErrors } from "./inner-errors";

/**
 * @type ErrorDetails
 * @export
 */
export type ErrorDetails = InnerErrors | { [key: string]: ErrorDetails };
