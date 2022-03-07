/**
 * Export translations in files
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.locale Specify language of translations to export.
 * @param {String} data.source_file_name Specify the name of the source file.
 * @param {String=} data.export_file_name Specify the name of export file that is the file to be returned.
 * @returns {Object}
 */
module.exports.export = (project_id, data) => [`projects/${project_id}/translations`, "GET", data];

/**
 * Export translations in multilingual files
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.source_file_name Specify the name of the source file.
 * @param {String=} data.export_file_name Specify the name of export file that is the file to be returned.
 * @param {String=} data.file_format Specify export file format, if different from source file format.
 * @returns {Object}
 */
module.exports.export_multilingual = (project_id, data) => [`projects/${project_id}/translations/multilingual`, "GET", data];

/**
 * Export translations of App Store Description in JSON
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.locale Specify language of translations to export.
 * @returns {Object}
 */
module.exports.export_appdescriptions = (project_id, data) => [`projects/${project_id}/translations/app-descriptions`, "GET", data];

/**
 * Translations status
 * Return the progress of the translation of a specific file.
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {String} data.file_name Specify the name of the source file to be translated.
 * @param {String} data.locale Specify language of translations to export.
 * @returns {Object}
 */
module.exports.status = (project_id, data) => [`projects/${project_id}/translations/status`, "GET", data];