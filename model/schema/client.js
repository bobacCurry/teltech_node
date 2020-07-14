const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ClientSchema = new Schema({

	uid:{ type: String, required: true, index: true },

	phone:{ type: String, required: true, index: true },

	info:{ type: Object, default: {} },
	//是否是代发号
	proxy:{ type: Number, default: 0 },
	// 管理员添加后状态是 0 加完群之后状态变为 1
	status:{ type: Number, default: 0 },

	used:{ type: Number, default: 0 }

},{ versionKey: false })

module.exports = mongoose.model('client', ClientSchema,'client')