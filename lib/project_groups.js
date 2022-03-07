/**
 * @param {Object} query_string Query string data
 * @param {Number=} query_string.page Set page number to retrieve. (min: 1) (default: 1)
 * @param {Number=} query_string.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
 * @returns {Array}
 */
module.exports.list = (query_string = {}) => ["project-groups", "GET", query_string];

/**
 * 
 * @param {Number} project_group_id 
 * @returns {Object}
 */
module.exports.show = (project_group_id) => [`project-groups/${project_group_id}`, "GET"];

/**
 * 
 * @param {Object} data 
 * @param {String} data.name Name of the project group
 * @param {String=} data.locale Locale code of the project group base language. (default: en | example: zh-TW)
 * @returns {Object}
 */
module.exports.create = (data) => ["project-groups", "POST", data];

/**
 * 
 * @param {Number} project_group_id 
 * @returns 
 */
module.exports.delete = (project_group_id) => [`project-groups/${project_group_id}`, "DELETE"];

/**
 * 
 * @param {Number} project_group_id 
 * @returns 
 */
module.exports.languages = (project_group_id) => [`project-groups/${project_group_id}/languages`, "GET"];
