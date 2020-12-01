const mongoose = require('../db.js')

const Schema = mongoose.Schema

const PersonSchema = new Schema({

	uid:{ type: String, required: true, index: true },

	target:{ type: String, required: true },

	text:{ type: String, default:'' },

	message_id:{ type: Number, default: null },

	no_admin:{ type: Boolean, default: true },

	phone_list:{ type: Array, default:[] },
	
	send_list:{ type: Array, default:[] },

	sended_list:{ type: Array, default:[] },

},{ versionKey: false })

module.exports = mongoose.model('person', PersonSchema,'person')