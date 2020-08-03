const mongoose = require('../db.js')

const Schema = mongoose.Schema

const add_member_schema = new Schema({

	uid:{ type: String, required: true, index: true },

	phone:{ type: Array, default: [] },

	target:{ type: String, required: true },

	chatids:{ type: Array, default:[] },

	success:{ type: Array, default:[] },

	fail:{ type: Array, default:[] },

	info:{ type: String, default:'' },
	//上次的执行时间
	exec:{ type: Number, default:0 },

	status:{ type: Number, default:0, index: true },

	created_at: { type: Date },

  	updated_at: { type: Date }

},{ versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' } })

module.exports = mongoose.model('add_member', add_member_schema,'add_member')