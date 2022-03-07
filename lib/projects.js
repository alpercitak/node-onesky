/**
*
* @param {Number} project_group_id Project Group Id
* @returns {Array}
*/
module.exports.list = (project_group_id) => [`project-groups/${project_group_id}/projects`, "GET"];

/**
*
* @param {Number} project_id Project Id
* @returns {Object}
*/
module.exports.show = (project_id) => [`projects/${project_id}`, "GET"];

/**
 * Creates a new project under given project group
 * @param {Number} project_group_id Project Group Id
 * @param {Object} data Object data
 * @param {String} data.project_type Project type
 * @param {String=} data.name Project name
 * @param {String=} data.description Project description
 * @returns {Object}
 */
module.exports.create = (project_group_id, data) => [`project-groups/${project_group_id}/projects`, "POST", data];

/**
 *
 * @param {Number} project_id Project Id
 * @param {Object} data Object data
 * @param {String=} data.name Project name
 * @param {String=} data.description Project description
 * @returns {Object}
 */
module.exports.update = (project_id, data) => [`projects/${project_id}`, "PUT", data];

/**
 *
 * @param {Number} project_id Project Id
 * @returns {Object}
 */
module.exports.delete = (project_id) => [`projects/${project_id}`, "DELETE"];

/**
 * 
 * @param {Number} project_id 
 * @returns {Array}
 */
module.exports.languages = (project_id) => [`projects/${project_id}/languages`, "GET"];