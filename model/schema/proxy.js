const mongoose = require('../db.js')

const Schema = mongoose.Schema

const ProxySchema = new Schema({

	hostname:{ type: String, default:'' },

	port:{ type: Number, default:0 },

	ping:{ type: Number, default:0 },

	minute:{ type: Number, default:0 }
	
},{ versionKey: false })

module.exports = mongoose.model('proxy', ProxySchema,'proxy')