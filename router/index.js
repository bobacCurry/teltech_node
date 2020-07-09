const account = require('./account/index')

const service = require('./service/index')

const admin = require('./admin/index')

module.exports = function(app) {

	admin(app)

	account(app)

	service(app)
}