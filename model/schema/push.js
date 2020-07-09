const mongoose = require('../db.js')

const Schema = mongoose.Schema

const PushSchema = new Schema({

	title:{ type: String, default:'' },

	uid:{ type: String, default:'', required: true, index: true },

	chat_type:{ type: Number, default:0 },

	text_type:{ type: Number, default:0 },

	phone:{ type: String, required: true, index: true },

	chat:{ type: Array, default:[] },

	from_chat_id:{ type: Number, required: true },

	message_id:{ type: Number, required: true },

	text:{ type: String, default:'' },

	media:{ type: String, default:'' },

	caption:{ type: String, default:'' },

	minute:{ type: Array, default:[] },

	count:{ type: Number, default:0 },

	status:{ type: Number, default:0 },

	expire:{ type: Number, default:0 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('push', PushSchema,'push')