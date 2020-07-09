const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ClientSchema = new Schema({

	uid:{ type: String, required: true, index: true },

	phone:{ type: String, required: true, index: true },

	info:{ type: Object, default: {} },

	status:{ type: Number, default: 0 },

	used:{ type: Number, default: 0 }

},{ versionKey: false })

module.exports = mongoose.model('Client', ClientSchema,'Client')