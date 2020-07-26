const mongoose = require('../db.js')

const Schema = mongoose.Schema

const QueueSchema = new Schema({

	phone:{ type: String, default:'' },

	chat:{ type: Array, default:[] },

	from_chat_id:{ type: Number, required: true },

	message_id:{ type: Number, required: true },

	text_type:{ type: Number, default:0 },

	text:{ type: String, default:'' },

	media:{ type: String, default:'' },

	caption:{ type: String, default:'' }
	
},{ versionKey: false })

module.exports = mongoose.model('queue', QueueSchema,'queue')