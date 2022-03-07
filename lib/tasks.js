/**
 * List import tasks
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
 * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
 * @param {String=} data.status Filter to show only import tasks of specific status with one of the followings [all (default) | completed | in-progress | failed]
 * @returns {Array}
 */
module.exports.list = (project_id, data) => [`projects/${project_id}/import-tasks`, "GET", data];

/**
 * Show an import task
 * @param {Number} project_id Project Id
 * @param {Number} import_id Import Id
 * @returns {Object}
 */
module.exports.show = (project_id, import_id) => [`projects/${project_id}/import-tasks/${import_id}`, "GET"];