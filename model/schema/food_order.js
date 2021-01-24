const mongoose = require('../db.js')

const Schema = mongoose.Schema

const FoodOrderSchema = new Schema({

	sid:{ type: ObjectId, ref: 'food_shop' },

	c_uid:{ type: Number, default: 0 },

	order:{ type: Array, default: [] },
	
	add_order:{ type: Array, default: [] },

	phone:{ type: String, default: '' },

	address:{ type: String, default: '' },
	// 0 配送 1 grab
	delivery:{ type: Number, default: 0 },

	delivery_fee:{ type: Number, default: 0 },

	c_memo:{ type: String, default: [] },

	b_memo:{ type: String, default: [] },

	sum:{ type: Number, default: 0 },

	status:{ type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date }

},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('food_order', FoodOrderSchema,'food_order')