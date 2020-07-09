const mongoose = require('../db.js')

const Schema = mongoose.Schema

const add_chat_schema = new Schema({

	uid:{ type: String, required: true, index: true },

	phone:{ type: String, required: true },

	chatids:{ type: Array, default:[] },

	success:{ type: Array, default:[] },

	fail:{ type: Array, default:[] },

	info:{ type: String, default:'' },
	//上次的执行时间
	exec:{ type: Number, default:0 },

	status:{ type: Number, default:0, index: true }

},{ versionKey: false })

module.exports = mongoose.model('add_chat', add_chat_schema,'add_chat')