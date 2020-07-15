const db_order = require('../../model/schema/order')

const db_push = require('../../model/schema/push')

const db_add_chat = require('../../model/schema/add_chat')

module.exports = {
	
	get_order : async (req, res, next) => {

		const page = req.query.page? req.query.page : 1

		const status = req.query.status? req.query.status : 0

		const limit = 50 

		const skip = (page-1)*limit
		
		try{

			const data = await db_order.find({ status }, 'days memo created_at status').limit(limit).skip(skip)

			return res.send({ success: true, msg: data })

		}catch(err){

			return next(new Error(err))
		}
	},
	start_order : async (req, res, next) => {

		const _id = req.params._id

		try{

			const order = await db_order.findOne({ _id, status: 0 })

			if (!order) {

				return res.send({ success: false, msg: '暂无改审核订单' })
			}

			const push = await db_push.findById(order.pid)

			if (!push) {

				return res.send({ success: false, msg: '订单服务不存在' })
			}

			const adding_chat = await db_add_chat.findOne({ phone: push.phone, status: 0 })

			if (adding_chat) {

				return res.send({ success: false, msg: '飞机号正在加群，暂时不能开启订单' }) 
			}

			let expire

			if (push.expire > new Date().getTime()) {

				expire = push.expire + order.days*24*3600*1000
			
			}else{

				expire = new Date().getTime() + order.days*24*3600*1000
			}

			await db_push.updateOne({ _id: push._id },{ expire, status: 1 })

			await db_order.updateOne({ _id },{ status: 1 })

			return res.send({ success: true, msg: '审核通过' })

		}catch(err){

			return next(new Error(err))
		}

	},
	del_order : async (req, res, next) => {

		const _id  = req.params._id

		try{

			await db_order.deleteOne({ _id })

			return res.send({ success: true, msg: '删除成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}