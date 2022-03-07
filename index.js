'use strict';

const fs = require("fs");
const url = require("url");
const path = require("path");
const axios = require("axios");
const md5 = require("md5");
const dot = require("dot-object");
const FormData = require("form-data");

function OneSky(params = {}) {
    const API_URL = "https://platform.api.onesky.io/1";
    const PUBLIC_KEY = params.PUBLIC_KEY;
    const SECRET_KEY = params.SECRET_KEY;
    const module = {};

    /**
     *
     * @returns {Object} Authorization query string parameters
     */
    const get_auth = () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const options = {
            api_key: PUBLIC_KEY,
            dev_hash: md5(timestamp + SECRET_KEY),
            timestamp: timestamp
        };
        return options;
    };

    /**
    *
    * @param {String} request_url
    * @param {String} request_method [GET, POST, PUT, DELETE]
    * @param {Object} payload
    * @returns
    */
    const make_request = async (request_url, request_method, payload = {}) => {
        const auth = get_auth();
        const query_string = {...auth};
        if (request_method == "GET" || request_method == "DELETE") {
            Object.assign(query_string, payload);
        }
        const final_query_string = new url.URLSearchParams(query_string);
        const final_url = `${API_URL}/${request_url}?${final_query_string}`;
        const request_options = {url: final_url, method: request_method, headers: {"accept": "application/json"}, data: payload};

        if (payload.file) {
            const form = new FormData();
            Object.keys(payload).map(x => {
                x === "file" ?
                    form.append(x, payload[x].value, payload[x].options) :
                    form.append(x, payload[x]);
            });
            request_options.headers = {
                ...request_options.headers,
                ...form.getHeaders()
            }
            request_options.data = form;
        }
        const response = await axios.request(request_options).catch(e => {throw e;});
        return (response || {}).data;
    };

    /**
    * Prepare modules
    */
    (() => {
        const add = (key, fn) => {
            fn = (() => {
                let original_fn = fn;
                return (...params) => {
                    const original_result = original_fn.apply(this, params);
                    return make_request(...original_result);
                };
            })();

            module[key] = fn;
            dot.object(module);
        };

        const lib_folder = path.join(__dirname, "./lib");
        const lib_files = fs.readdirSync(lib_folder);
        lib_files.map(file => {
            const module = require(path.join(lib_folder, file));
            Object.keys(module).map(m => add(`${path.basename(file, path.extname(file))}.${m}`, module[m]));
        });
    })();

    return module;
};

module.exports = OneSky;