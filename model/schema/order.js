const mongoose = require('../db.js')

const Schema = mongoose.Schema

const OrderSchema = new Schema({

	pid:{ type: String, required: true, index: true },

	uid:{ type: String, required: true, index: true },

	days:{ type: Number, default:0 },

	memo:{ type: String, default:'' },

	status:{ type: Number, default:0 },

	created_at: { type: Date },

  	updated_at: { type: Date }
},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('Order', OrderSchema,'Order')