const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ChatSchema = new Schema({

	type:{ type: Number, default: 0 },

	chatid:{ type: String, required: true, index: true },

	chatname:{ type: String, required: true },

	auth:{ type: Number, default: 0 },

	group:{ type: String, default: '', index: true },

	status:{ type: Number, default: 0 }

},{ versionKey: false })

module.exports = mongoose.model('Chat', ChatSchema,'Chat')