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
module.exports.show = (project_id, data) => [`projects/${project_id}/quotations`, "GET", data]