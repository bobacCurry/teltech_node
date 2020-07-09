module.exports = function(app) {

	app.use('/admin/user', require('./user'))

	app.use('/admin/chat', require('./chat'))

	app.use('/admin/order', require('./order'))

}