const account = require('./account/index')

const service = require('./service/index')

const common = require('./common/index')

const admin = require('./admin/index')

const bots =  require('./bots/index')

module.exports = function(app) {

	account(app)

	service(app)

	common(app)

	admin(app)

	bots(app)
}