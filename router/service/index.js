module.exports = function(app) {

	app.use('/service/vip', require('./vip'))

	app.use('/service/push', require('./push'))

	app.use('/service/auth', require('./auth'))

	app.use('/service/chat', require('./chat'))

	app.use('/service/push', require('./push'))

	app.use('/service/order', require('./order'))

	app.use('/service/client', require('./client'))
	
}