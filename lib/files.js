/**
 * List uploaded files
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
 * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
 * @returns {Object}
 */
module.exports.list = (project_id, data) => [`projects/${project_id}/files`, "GET", data];

/**
 * Upload a file
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.file File contains strings to translate
 * @param {String} data.file_format Specify the input format. [HIERARCHICAL_JSON]
 * @param {String=} data.locale Specify the input language. If locale is different from base language, the strings will add to translation strings.
 * @param {Boolean=} data.is_keeping_all_strings For strings that cannot be found in newly uploaded file with same file name, keep those strings unchange if set to true. Deprecate those strings if set to false. Notice that different files will not interfere each other in the same project. For example, with setting is_keeping_all_strings to false, uploading en2.po will not deprecate strings of previously uploaded file, en.po. [true* | false]
 * @param {Boolean=} data.is_allow_translation_same_as_original This setting applies to translation upload, skip importing translations that are the same as source text if set to false. Keeping the translations that are the same as source text if set to true. [true | false*]
 * @returns {Object}
 */
module.exports.upload = (project_id, data) => [`projects/${project_id}/files`, "POST", data];

/**
 * Delete a file
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.file_name Specify name of file to delete.
 * @returns {Object}
 */
module.exports.delete = (project_id, data) => [`projects/${project_id}/files`, "DELETE", data];