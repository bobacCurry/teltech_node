const account = require('./account/index')

const service = require('./service/index')

const admin = require('./admin/index')

const common = require('./common/index')

module.exports = function(app) {

	admin(app)

	account(app)

	service(app)

	common(app)
}