'use strict';

import url from 'url';
import request, { type AxiosRequestConfig } from 'axios';
import md5 from 'md5';
import FormData from 'form-data';
import type {
  OneskyParams,
  RequestPayload,
  RequestPayloadFilesDelete,
  RequestPayloadFilesList,
  RequestPayloadFilesUpload,
  RequestPayloadProjectGroupsCreate,
  RequestPayloadProjectGroupsList,
} from './types';
import { isFile } from './utils';

export class OneSky {
  private readonly PublicKey: string;
  private readonly SecretKey: string;
  private readonly API_URL = 'https://platform.api.onesky.io/1';

  constructor(params: OneskyParams) {
    this.PublicKey = params.PUBLIC_KEY;
    this.SecretKey = params.SECRET_KEY;
  }

  private getAuth = (): { api_key: string; dev_hash: string; timestamp: string } => {
    const timestamp = Math.floor(Date.now() / 1000);
    return { api_key: this.PublicKey, dev_hash: md5(timestamp + this.SecretKey), timestamp: String(timestamp) };
  };

  private makeRequest = async (requestUrl: string, requestMethod: string, payload: RequestPayload = {}) => {
    const auth = this.getAuth();
    const queryString = { ...auth };
    if (requestMethod == 'GET' || requestMethod == 'DELETE') {
      Object.assign(queryString, payload);
    }
    const finalQueryString = new url.URLSearchParams(queryString);
    const finalUrl = `${this.API_URL}/${requestUrl}?${finalQueryString}`;
    const request_options = <AxiosRequestConfig>{
      url: finalUrl,
      method: requestMethod,
      headers: { accept: 'application/json' },
      data: payload,
    };

    if (isFile(payload)) {
      const form = new FormData();
      const fileUploadPayload = payload as RequestPayloadFilesUpload;
      Object.keys(payload).forEach((x) => {
        if (x === 'file') {
          form.append(x, fileUploadPayload[x].value, fileUploadPayload[x].options);
        } else {
          form.append(x, fileUploadPayload[x as keyof RequestPayloadFilesUpload]);
        }
      });
      request_options.headers = {
        ...request_options.headers,
        ...form.getHeaders(),
      };
      request_options.data = form;
    }

    const response = await request(request_options).catch((e) => {
      throw e;
    });
    return (response || {}).data;
  };

  files = {
    /**
     * List uploaded files
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
     * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
     * @returns {Object}
     */
    list: (project_id: number, data: RequestPayloadFilesList) =>
      this.makeRequest(`projects/${project_id}/files`, 'GET', data),

    /**
     * Upload a file
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.file File contains strings to translate
     * @param {String} data.file_format Specify the input format. [HIERARCHICAL_JSON]
     * @param {String=} data.locale Specify the input language. If locale is different from base language, the strings will add to translation strings.
     * @param {Boolean=} data.is_keeping_all_strings For strings that cannot be found in newly uploaded file with same file name, keep those strings unchange if set to true. Deprecate those strings if set to false. Notice that different files will not interfere each other in the same project. For example, with setting is_keeping_all_strings to false, uploading en2.po will not deprecate strings of previously uploaded file, en.po. [true*|false]
     * @param {Boolean=} data.is_allow_translation_same_as_original This setting applies to translation upload, skip importing translations that are the same as source text if set to false. Keeping the translations that are the same as source text if set to true. [true|false*]
     * @returns {Object}
     */
    upload: (project_id: number, data: RequestPayloadFilesUpload) =>
      this.makeRequest(`projects/${project_id}/files`, 'POST', data),

    /**
     * Upload a file
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.file File contains strings to translate
     * @param {String} data.file_format Specify the input format. [HIERARCHICAL_JSON]
     * @param {String=} data.locale Specify the input language. If locale is different from base language, the strings will add to translation strings.
     * @param {Boolean=} data.is_keeping_all_strings For strings that cannot be found in newly uploaded file with same file name, keep those strings unchange if set to true. Deprecate those strings if set to false. Notice that different files will not interfere each other in the same project. For example, with setting is_keeping_all_strings to false, uploading en2.po will not deprecate strings of previously uploaded file, en.po. [true*|false]
     * @param {Boolean=} data.is_allow_translation_same_as_original This setting applies to translation upload, skip importing translations that are the same as source text if set to false. Keeping the translations that are the same as source text if set to true. [true|false*]
     * @returns {Object}
     */
    delete: (project_id: number, data: RequestPayloadFilesDelete) =>
      this.makeRequest(`projects/${project_id}/files`, 'DELETE', data),
  };
  locales = {
    /**
     * List all locales
     * @returns {Array}
     */
    list: () => this.makeRequest('locales', 'GET'),
  };
  orders = {
    /**
     * Retrieve all orders
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
     * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
     * @param {String=} data.file_name Filter orders by file name.
     * @returns {Array}
     */
    list: (project_id: number, data: object) => this.makeRequest(`projects/${project_id}/orders`, 'GET', data),

    /**
     * Retrieve details of an order
     * @param {Number} project_id Project Id
     * @param {Number} order_id Order Id
     * @returns {Object}
     */
    show: (project_id: number, order_id: number) =>
      this.makeRequest(`projects/${project_id}/orders/${order_id}`, 'GET'),

    /**
     * Create a new order
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {Array} data.files Files to be translated in the order [['en.json']]
     * @param {String} data.to_locale Target language to tranlate [es]
     * @param {String=} data.order_type Specify type of order. [translate-only|review-only*|translate-review]
     * @param {Boolean=} data.is_including_not_translated Include not translated phrases to translate
     * @param {Boolean=} data.is_including_not_approved Include not approved phrases to translate
     * @param {Boolean=} data.is_including_outdated Include outdated phrases to translate that is updated since last order.
     * @param {String=} data.translator_type Specify type of translator used in translation. [preferred*|fastest]
     * @param {String=} data.tone Specify the tone used in translation. [not-specified*|format|informal]
     * @param {String=} data.specialization Specify specialization in order to translate phrases in a specific area. [general|game]
     * @param {String=} data.note Note to translator
     * @returns {Object}
     */
    create: (project_id: number, data: object) => this.makeRequest(`projects/${project_id}/orders`, 'POST', data),
  };
  project_groups = {
    /**
     * @param {Object} query_string Query string data
     * @param {Number=} query_string.page Set page number to retrieve. (min: 1) (default: 1)
     * @param {Number=} query_string.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
     * @returns {Array}
     */
    list: (data: RequestPayloadProjectGroupsList) => this.makeRequest('project-groups', 'GET', data),

    /**
     *
     * @param {Number} project_group_id
     * @returns {Object}
     */
    show: (project_group_id: number) => this.makeRequest(`project-groups/${project_group_id}`, 'GET'),

    /**
     *
     * @param {Object} data
     * @param {String} data.name Name of the project group
     * @param {String=} data.locale Locale code of the project group base language. (default: en | example: zh-TW)
     * @returns {Object}
     */
    create: (data: RequestPayloadProjectGroupsCreate) => this.makeRequest('project-groups', 'POST', data),

    /**
     *
     * @param {Number} project_group_id
     * @returns
     */
    delete: (project_group_id: number) => this.makeRequest(`project-groups/${project_group_id} `, 'DELETE'),

    /**
     *
     * @param {Number} project_group_id
     * @returns
     */
    languages: (project_group_id: number) => this.makeRequest(`project-groups/${project_group_id}/languages`, 'GET'),
  };
  project_types = {
    /**
     *
     * @returns {Array}
     */
    list: () => this.makeRequest('project-types', 'GET'),
  };
  projects = {
    /**
     *
     * @param {Number} project_group_id Project Group Id
     * @returns {Array}
     */
    list: (project_group_id: number) => this.makeRequest(`project-groups/${project_group_id}/projects`, 'GET'),

    /**
     *
     * @param {Number} project_id Project Id
     * @returns {Object}
     */
    show: (project_id: number) => this.makeRequest(`projects/${project_id}`, 'GET'),

    /**
     * Creates a new project under given project group
     * @param {Number} project_group_id Project Group Id
     * @param {Object} data Object data
     * @param {String} data.project_type Project type
     * @param {String=} data.name Project name
     * @param {String=} data.description Project description
     * @returns {Object}
     */
    create: (project_group_id: number, data: RequestPayload) =>
      this.makeRequest(`project-groups/${project_group_id}/projects`, 'POST', data),

    /**
     *
     * @param {Number} project_id Project Id
     * @param {Object} data Object data
     * @param {String=} data.name Project name
     * @param {String=} data.description Project description
     * @returns {Object}
     */
    update: (project_id: number, data: RequestPayload) => this.makeRequest(`projects/${project_id}`, 'PUT', data),

    /**
     *
     * @param {Number} project_id Project Id
     * @returns {Object}
     */
    delete: (project_id: number) => this.makeRequest(`projects/${project_id}`, 'DELETE'),

    /**
     *
     * @param {Number} project_id
     * @returns {Array}
     */
    languages: (project_id: number) => this.makeRequest(`projects/${project_id}/languages`, 'GET'),
  };
  quotations = {
    /**
     * Make a quotation
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {Array} data.files Files to be translated in the order [['en.json']]
     * @param {String} data.to_locale Target language to tranlate [es]
     * @param {Boolean=} data.is_including_not_translated Include not translated phrases to translate
     * @param {Boolean=} data.is_including_not_approved Include not approved phrases to translate
     * @param {Boolean=} data.is_including_outdated Include outdated phrases to translate that is updated since last order.
     * @param {String=} data.specialization Specify specialization in order to translate phrases in a specific area. [general | game]
     * @returns {Object}
     */
    show: (project_id: number, data: object) => this.makeRequest(`projects/${project_id}/quotations`, 'GET', data),
  };
  tasks = {
    /**
     * List import tasks
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
     * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
     * @param {String=} data.status Filter to show only import tasks of specific status with one of the followings [all*|completed|in-progress|failed]
     * @returns {Array}
     */
    list: (project_id: number, data: object) => this.makeRequest(`projects/${project_id}/import-tasks`, 'GET', data),

    /**
     * Show an import task
     * @param {Number} project_id Project Id
     * @param {Number} import_id Import Id
     * @returns {Object}
     */
    show: (project_id: number, import_id: number) =>
      this.makeRequest(`projects/${project_id}/import-tasks/${import_id}`, 'GET'),
  };
  translations = {
    /**
     * Export translations in files
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.locale Specify language of translations to export.
     * @param {String} data.source_file_name Specify the name of the source file.
     * @param {String=} data.export_file_name Specify the name of export file that is the file to be returned.
     * @returns {Promise<any>}
     */
    export: (project_id: number, data: RequestPayload) =>
      this.makeRequest(`projects/${project_id}/translations`, 'GET', data),

    /**
     * Export translations in multilingual files
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.source_file_name Specify the name of the source file.
     * @param {String=} data.export_file_name Specify the name of export file that is the file to be returned.
     * @param {String=} data.file_format Specify export file format, if different from source file format.
     * @returns {Object}
     */
    export_multilingual: (project_id: number, data: object) =>
      this.makeRequest(`projects/${project_id}/translations/multilingual`, 'GET', data),

    /**
     * Export translations of App Store Description in JSON
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.locale Specify language of translations to export.
     * @returns {Object}
     */
    export_appdescriptions: (project_id: number, data: object) =>
      this.makeRequest(`projects/${project_id}/translations/app-descriptions`, 'GET', data),

    /**
     * Translations status
     * Return the progress of the translation of a specific file.
     * @param {Number} project_id Project Id
     * @param {Object} data Query string data
     * @param {String} data.file_name Specify the name of the source file to be translated.
     * @param {String} data.locale Specify language of translations to export.
     * @returns {Object}
     */
    status: (project_id: number, data: object) =>
      this.makeRequest(`projects/${project_id}/translations/status`, 'GET', data),
  };
}
