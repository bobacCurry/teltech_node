const mongoose = require('../db.js')

const Schema = mongoose.Schema

const FoodShopSchema = new Schema({

	name:{ type: String, default: '' },

	welfare:{ type: Array, default: [] },

	owner:{ type: String, default: '' },

	proxy:{ type: String, default: '' },

	menu_cat:{ type: Array, default: [] },

	menu:{ type: Array, default: [] },

	token:{ type: String, required: true, index: true },

	created_at: { type: Date },

  	updated_at: { type: Date }

},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('food_shop', FoodShopSchema,'food_shop')