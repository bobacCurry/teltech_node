module.exports = function(app) {

	app.use('/bots/butler', require('./butler'))
	
}