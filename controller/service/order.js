const db_order = require('../../model/schema/order')

const db_push = require('../../model/schema/push')

const money = require('../account/money')

module.exports = {

	add_order: async (req, res, next)=>{

		const uid = req.user._id
		
		const pid = req.body.pid

		const days = req.body.days

		const memo = req.body.memo

		try{

			const push = await db_push.findById(pid)

			if (!push) {

				return res.send({ success: false, msg: '服务不存在' })
			}

			const order = await db_order.findOne({ pid, uid, status: 0 })

			if (order) {

				return res.send({ success: false, msg: '存在未处理的订单' })
			}

			await db_order.create({ uid, pid, days, memo })

			await money.inc_money(uid,400)

			return res.send({ success: true, msg: '订单提交成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_order: async (req, res, next)=>{

		const uid = req.user._id

		const page = req.params.page

		const status = req.params.status

		const limit = 50

		const skip = (page-1)*limit

		try{

			const data = await db_order.find({ uid, status }).skip(skip).limit(limit)

			return res.send({ success: true, msg: data })
		
		}catch(err){

			return next(new Error(err))
		}
	},
	del_order: async (req, res, next)=>{

		const uid = req.user._id

		const _id = req.params._id

		try{

			const ret = await db_order.deleteOne({ _id, uid })

			return res.send({ success: true, msg: '删除订单成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}