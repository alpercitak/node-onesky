/**
 * Retrieve all orders
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {Number=} data.page Set page number to retrieve. (min: 1) (default: 1)
 * @param {Number=} data.per_page Set how many groups to retrieve for each time. (max: 100, min: 1)
 * @param {String=} data.file_name Filter orders by file name.
 * @returns {Array}
 */
module.exports.list = (project_id, data) => [`projects/${project_id}/orders`, "GET", data]

/**
 * Retrieve details of an order
 * @param {Number} project_id Project Id
 * @param {Number} order_id Order Id
 * @returns {Object}
 */
module.exports.show = (project_id, order_id) => [`projects/${project_id}/orders/${order_id}`, "GET"]

/**
 * Create a new order
 * @param {Number} project_id Project Id
 * @param {Object} data Query string data
 * @param {Array} data.files Files to be translated in the order [['en.json']]
 * @param {String} data.to_locale Target language to tranlate [es]
 * @param {String=} data.order_type Specify type of order. [translate-only | review-only (default) | translate-review]
 * @param {Boolean=} data.is_including_not_translated Include not translated phrases to translate
 * @param {Boolean=} data.is_including_not_approved Include not approved phrases to translate
 * @param {Boolean=} data.is_including_outdated Include outdated phrases to translate that is updated since last order.
 * @param {String=} data.translator_type Specify type of translator used in translation. [preferred (default) | fastest]
 * @param {String=} data.tone Specify the tone used in translation. [not-specified (default) | format | informal]
 * @param {String=} data.specialization Specify specialization in order to translate phrases in a specific area. [general | game]
 * @param {String=} data.note Note to translator
 * @returns {Object}
 */
module.exports.create = (project_id, data) => [`projects/${project_id}/orders`, "POST", data]