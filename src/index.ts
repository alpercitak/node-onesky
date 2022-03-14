'use strict';

import url = require('url');
import request, { AxiosRequestConfig } from 'axios';
import md5 = require('md5');
import FormData = require('form-data');

interface onesky_params {
    PUBLIC_KEY: string;
    SECRET_KEY: string
}

interface request_payload {
}

interface request_payload_files_list extends request_payload {
    page?: number,
    per_page?: number
}

interface request_payload_files_upload extends request_payload {
    file: {
        value: object,
        options: object
    },
    file_format: string,
    locale?: string,
    is_keeping_all_strings?: boolean,
    is_allow_translation_same_as_original?: boolean
}

interface request_payload_files_delete extends request_payload {
    file_name: string
}

interface request_payload_project_groups_list extends request_payload {
    page?: number,
    per_page?: number
}

interface request_payload_project_groups_create extends request_payload {
    name: string,
    locale?: string
}

function isFile(payload: request_payload): payload is request_payload_files_upload {
    return (<request_payload_files_upload>payload).file !== undefined;
}

class OneSky {
    private PUBLIC_KEY: string;
    private SECRET_KEY: string;
    private API_URL = 'https://platform.api.onesky.io/1';

    constructor(params: onesky_params) {
        this.PUBLIC_KEY = params.PUBLIC_KEY;
        this.SECRET_KEY = params.SECRET_KEY;
    }

    private get_auth = (): object => {
        const timestamp = Math.floor(Date.now() / 1000);
        const options = { api_key: this.PUBLIC_KEY, dev_hash: md5(timestamp + this.SECRET_KEY), timestamp: timestamp };
        return options;
    };

    private make_request = async (request_url: string, request_method: string, payload: request_payload = {}) => {
        const auth = this.get_auth();
        const query_string = { ...auth };
        if (request_method == 'GET' || request_method == 'DELETE') {
            Object.assign(query_string, payload);
        }
        const final_query_string = new url.URLSearchParams(query_string);
        const final_url = `${this.API_URL}/${request_url}?${final_query_string}`;
        const request_options = <AxiosRequestConfig>{
            url: final_url,
            method: request_method,
            headers: { accept: 'application/json' },
            data: payload,
        };

        if (isFile(payload)) {
            const form = new FormData();
            Object.keys(payload).map((x) => {
                x === 'file' ?
                    form.append(x, payload[x].value, payload[x].options)
                    :
                    form.append(x, payload[x as keyof request_payload_files_upload]);
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
        list: (project_id: number, data: request_payload_files_list) => this.make_request(`projects/${project_id}/files`, 'GET', data),

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
        upload: (project_id: number, data: request_payload_files_upload) => this.make_request(`projects/${project_id}/files`, 'POST', data),

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
        delete: (project_id: number, data: request_payload_files_delete) => this.make_request(`projects/${project_id}/files`, 'DELETE', data)
    };
    locales = {
        /**
        * List all locales
        * @returns {Array}
        */
        list: () => this.make_request('locales', 'GET')
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
        list: (project_id: number, data: object) => this.make_request(`projects/${project_id}/orders`, "GET", data),

        /**
        * Retrieve details of an order
        * @param {Number} project_id Project Id
        * @param {Number} order_id Order Id
        * @returns {Object}
        */
        show: (project_id: number, order_id: number) => this.make_request(`projects/${project_id}/orders/${order_id}`, "GET"),

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
        create: (project_id: number, data: object) => this.make_request(`projects/${project_id}/orders`, "POST", data)
    };
    project_groups = {
        /**
        * @param {Object} query_string Query string data
        * @param {Number=} query_string.page Set page number to retrieve. (min: 1) (default: 1)
        * @param {Number=} query_string.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
        * @returns {Array}
        */
        list: (data: request_payload_project_groups_list) => this.make_request('project-groups', 'GET', data),

        /**
        * 
        * @param {Number} project_group_id 
        * @returns {Object}
        */
        show: (project_group_id: number) => this.make_request(`project-groups/${project_group_id}`, 'GET'),

        /**
        * 
        * @param {Object} data 
        * @param {String} data.name Name of the project group
        * @param {String=} data.locale Locale code of the project group base language. (default: en | example: zh-TW)
        * @returns {Object}
        */
        create: (data: request_payload_project_groups_create) => this.make_request('project-groups', 'POST', data),

        /**
        * 
        * @param {Number} project_group_id 
        * @returns 
        */
        delete: (project_group_id: number) => this.make_request(`project-groups/${project_group_id} `, 'DELETE'),

        /**
        * 
        * @param {Number} project_group_id 
        * @returns 
        */
        languages: (project_group_id: number) => this.make_request(`project-groups/${project_group_id}/languages`, 'GET')
    };
    project_types = {
        /**
        * 
        * @returns {Array}
        */
        list: () => this.make_request('project-types', 'GET')
    };
    projects = {
        /**
        *
        * @param {Number} project_group_id Project Group Id
        * @returns {Array}
        */
        list: (project_group_id: number) => this.make_request(`project-groups/${project_group_id}/projects`, 'GET'),

        /**
        *
        * @param {Number} project_id Project Id
        * @returns {Object}
        */
        show: (project_id: number) => this.make_request(`projects/${project_id}`, 'GET'),

        /**
        * Creates a new project under given project group
        * @param {Number} project_group_id Project Group Id
        * @param {Object} data Object data
        * @param {String} data.project_type Project type
        * @param {String=} data.name Project name
        * @param {String=} data.description Project description
        * @returns {Object}
        */
        create: (project_group_id: number, data: request_payload) => this.make_request(`project-groups/${project_group_id}/projects`, 'POST', data),

        /**
        *
        * @param {Number} project_id Project Id
        * @param {Object} data Object data
        * @param {String=} data.name Project name
        * @param {String=} data.description Project description
        * @returns {Object}
        */
        update: (project_id: number, data: request_payload) => this.make_request(`projects/${project_id}`, 'PUT', data),

        /**
        *
        * @param {Number} project_id Project Id
        * @returns {Object}
        */
        delete: (project_id: number) => this.make_request(`projects/${project_id}`, 'DELETE'),

        /**
        * 
        * @param {Number} project_id 
        * @returns {Array}
        */
        languages: (project_id: number) => this.make_request(`projects/${project_id}/languages`, 'GET'),
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
        show: (project_id: number, data: object) => this.make_request(`projects/${project_id}/quotations`, "GET", data)
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
        list: (project_id: number, data: object) => this.make_request(`projects/${project_id}/import-tasks`, "GET", data),

        /**
        * Show an import task
        * @param {Number} project_id Project Id
        * @param {Number} import_id Import Id
        * @returns {Object}
        */
        show: (project_id: number, import_id: number) => this.make_request(`projects/${project_id}/import-tasks/${import_id}`, "GET")
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
        export: (project_id: number, data: request_payload) => this.make_request(`projects/${project_id}/translations`, 'GET', data),

        /**
        * Export translations in multilingual files
        * @param {Number} project_id Project Id
        * @param {Object} data Query string data
        * @param {String} data.source_file_name Specify the name of the source file.
        * @param {String=} data.export_file_name Specify the name of export file that is the file to be returned.
        * @param {String=} data.file_format Specify export file format, if different from source file format.
        * @returns {Object}
        */
        export_multilingual: (project_id: number, data: object) => this.make_request(`projects/${project_id}/translations/multilingual`, "GET", data),

        /**
         * Export translations of App Store Description in JSON
         * @param {Number} project_id Project Id
         * @param {Object} data Query string data
         * @param {String} data.locale Specify language of translations to export.
         * @returns {Object}
         */
        export_appdescriptions: (project_id: number, data: object) => this.make_request(`projects/${project_id}/translations/app-descriptions`, "GET", data),

        /**
         * Translations status
         * Return the progress of the translation of a specific file.
         * @param {Number} project_id Project Id
         * @param {Object} data Query string data
         * @param {String} data.file_name Specify the name of the source file to be translated.
         * @param {String} data.locale Specify language of translations to export.
         * @returns {Object}
         */
        status: (project_id: number, data: object) => this.make_request(`projects/${project_id}/translations/status`, "GET", data)
    }
}

export = OneSky;