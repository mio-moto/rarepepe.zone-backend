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
import { GithubUser } from './github-user';

/**
 * 
 * @export
 * @interface GithubDiscussion
 */
export interface GithubDiscussion {
    /**
     * 
     * @type {any}
     * @memberof GithubDiscussion
     */
    'title': any;
    /**
     * 
     * @type {any}
     * @memberof GithubDiscussion
     */
    'number': any;
    /**
     * 
     * @type {any}
     * @memberof GithubDiscussion
     */
    'html_url': any;
    /**
     * 
     * @type {any}
     * @memberof GithubDiscussion
     */
    'answer_html_url'?: any;
    /**
     * 
     * @type {any}
     * @memberof GithubDiscussion
     */
    'body'?: any;
    /**
     * 
     * @type {GithubUser}
     * @memberof GithubDiscussion
     */
    'user': GithubUser;
}

