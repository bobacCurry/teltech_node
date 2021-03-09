const mongoose = require('../db.js')

const Schema = mongoose.Schema

const FoodOrderSchema = new Schema({
	//店铺id
	sid:{ type: ObjectId, ref: 'food_shop' },
	//客户信息
	cus:{ type: Object, default: {} },
	//点单
	order:{ type: Array, default: [] },
	//加单
	add_order:{ type: Array, default: [] },

	phone:{ type: String, default: '' },

	address:{ type: String, default: '' },
	// 0 配送 1 grab
	delivery:{ type: Number, default: 0 },

	delivery_fee:{ type: Number, default: 0 },
	//客户备注
	c_memo:{ type: String, default: '' },
	//商家备注
	b_memo:{ type: String, default: '' },
	//总计
	sum:{ type: Number, default: 0 },
	//订单状态 0 下单中 1 下单确认 2 排单中 3 制作中 4 制作完成，等待配送 5 配送中 6 订单完成 -1 订单取消
	status:{ type: Number, default: 0 },

	created_at: { type: Date },

  	updated_at: { type: Date }

},
{

	versionKey: false, timestamps: { createdAt:'created_at',updatedAt:'updated_at' }

})

module.exports = mongoose.model('food_order', FoodOrderSchema,'food_order')