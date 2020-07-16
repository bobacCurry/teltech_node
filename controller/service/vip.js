const push_obj = require('../../model/schema/push')

const client_obj = require('../../model/schema/client')

const add_chat_obj = require('../../model/schema/add_chat')

module.exports = {

	add_chat: async (req, res, next) => {

		const uid = req.user._id

		const { phone, chatids } = req.body

		if (!phone||!chatids||!chatids.length) {

			return res.send({ success: false, msg: '信息不完善，创建失败' })
		}

		try{

			const client = await client_obj.findOne({ uid, phone, status: { $in:[ 0, 1, 2 ] } })

			if (!client) {

				return res.send({ success: false, msg: '请确认该飞机号是正常的' })
			}

			const add_chat = await add_chat_obj.findOne({ phone, status: 0 })

			if (add_chat) {

				return res.send({ success: false, msg: '飞机号正在加群中，请勿重复添加' })
			}

			const push = await push_obj.findOne({ phone, status: 1 })

			if (push) {

				return res.send({ success: false, msg: '飞机号正在进行群发服务，请先停止其群发服务' })
			}

			await add_chat_obj.create({ uid, phone, chatids })

			return res.send({ success: true, msg: '添加成功' })

		}catch(e){

			return next(new Error(e))
		}
	},
	get_add_chat: async (req, res, next) => {

		const uid = req.user._id

		const page = req.params.page? req.params.page: 1

		const limit = 50

		const skip = (page-1)*limit

		try{

			const data = await add_chat_obj.find({ uid }).limit(limit).skip(skip)

		}catch(e){

			return next(new Error(e))
		}

		res.send({ success: true, msg: data })
	},
	del_add_chat: async (req, res, next) => {

		const uid = req.user._id

		const _id = req.params._id

		try{

			await add_chat_obj.deleteOne({ _id, uid })

		}catch(e){

			return next(new Error(e))
		}

		res.send({ success: true, msg: '删除服务成功' })
	},
	update_add_chat: async (req, res, next) => {

		const uid = req.user._id

		const _id = req.params._id

		try{

			await add_chat_obj.updateOne({ _id, uid },{ status:0, info:'' })

		}catch(e){

			return next(new Error(e))
		}

		res.send({ success: true, msg: '更新服务成功' })
	}
}