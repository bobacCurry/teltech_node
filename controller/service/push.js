const db_push = require('../../model/schema/push')

const cp = require('child_process')

const push_obj = require('../../model/schema/push')

const client_obj = require('../../model/schema/client')

const add_chat_obj = require('../../model/schema/add_chat')

const cache = require('../../cache')

module.exports = {

	get: async (req, res, next) => {
	
		const limit = 50

		const page = req.params.page

		const skip = (page-1)*limit

		const uid = req.user._id

		try{
			
			const data = await db_push.find({uid},'title phone status expire minute chat_type text_type').skip(skip).limit(50)

			return res.send({ success: true, msg: data })

		}catch(e){

			return next(new Error(err))
		}
	},
	get_one: async (req, res, next) => {
	
		const uid = req.user._id

		const _id = req.params._id

		try{
			
			const data = await db_push.findOne({ _id, uid })

			return res.send({ success: true, msg: data })
		
		}catch(e){

			return next(new Error(err))
		}
	},
	add: async (req, res, next) => {

		const uid = req.user._id
	
		let { title, chat_type, text_type, phone, chat, text, media, caption, minute, count } = req.body

		if (!phone||!phone.trim()) {

			return res.send({ success: false, msg: '飞机 不得为空' })
		}

		title = title? title: ''

		chat_type = chat_type? Number(chat_type): 0

		text_type = text_type? Number(text_type): 0

		minute = minute? Number(minute): 0

		count = count? Number(count): 4

		let gap = 60/count

		if (count<1||count>4) {

			count = 1
		}

		if (minute+(count-1)*gap>=60) {

			return res.send({ success: false, msg: '时间提交错误' })
		}

		minute = [ minute, minute+gap, minute+2*gap, minute+3*gap ].slice(0,count)

		if ((!text_type&&(!text||!text.trim()))||(text_type&&!media)) {

			return res.send({ success: false, msg: '文案不得为空' })
		}

		const client = await client_obj.findOne({ phone, uid, used:0 , status:1 })

		if (!client) {

			return res.send({ success: false, msg: '飞机非法或已被占用' })
		}

		// if(await cache.get(`pushing_${phone}`)){

		// 	return res.send({ success:false, msg:'保存中，请勿重复发送'})
		// }

		await push_obj.create({ uid, title, chat_type, text_type, phone, chat, text, media, caption, minute, message_id:0, from_chat_id:0, count })

		await client_obj.updateOne({ phone },{ used: 1 })

		// await cache.set(`pushing_${phone}`,1)

		// const n = cp.fork('client/index.js',{ detached:true })

		// n.send({ phone, action: 'push', data: { text_type, text, caption, media } })

		// n.on('message', async (m) => {

		// 	await cache.del(`pushing_${phone}`)

		// 	if (!m.success||!m.msg) {

		// 		if (m.msg==='PHONE_UNBINDED') {

		// 			await client_obj.updateOne({ phone },{ status: 3 })
		// 		}

		// 		return res.send(m)
		// 	}

		// 	const message_id = m.msg.id

		// 	const from_chat_id = m.msg.chat_id

		// 	try{

		// 		await push_obj.create({ uid, title, chat_type, text_type, phone, chat, text, media, caption, minute, message_id, from_chat_id, count })

		// 		await client_obj.updateOne({ phone },{ used: 1 })

		// 	}catch(e){

		// 		return next(new Error(e))
		// 	}

			return res.send({ success: true, msg: '创建服务成功' })
		// })
	},
	update: async (req, res, next) => {
		
		const uid = req.user._id

		const _id = req.params._id
	
		let { title, chat_type, text_type, phone, chat, text, media, caption, minute, count } = req.body

		if (!phone||!phone.trim()) {

			return res.send({ success: false, msg: '飞机 不得为空' })
		}

		const push = await push_obj.findOne({ _id, uid })

		if (!push) {

			return res.send({ success: false, msg: '服务不存在' })
		}

		const client = await client_obj.findOne({ phone, uid , status:{ $in:[ 0, 1, 2 ] } })

		if (!client||(client.used&&(push.phone!=phone))) {

			return res.send({ success: false, msg: '飞机被占用或者已被封禁' })
		}

		title = title? title: ''

		media = media? media: ''

		caption = caption? caption: ''

		chat_type = chat_type? Number(chat_type): 0

		text_type = text_type? Number(text_type): 0

		minute = minute? Number(minute): 0

		count = count? Number(count): 4

		let gap = 60/count

		if (count<1||count>4) {

			count = 1
		}

		if (minute+(count-1)*gap>=60) {

			return res.send({ success: false, msg: '时间提交错误' })
		}

		minute = [ minute, minute+gap, minute+2*gap, minute+3*gap ].slice(0,count)

		if ((!text_type&&(!text||!text.trim()))||(text_type&&!media)) {

			return res.send({ success: false, msg: '文案不得为空' })
		}

		// if(await cache.get(`pushing_${phone}`)){

		// 	return res.send({ success:false, msg:'保存中，请勿重复发送'})
		// }

		await push_obj.findByIdAndUpdate(_id, { uid, title, chat_type, text_type, phone, chat, text, media, caption, minute, count, message_id:0 , from_chat_id:0 })

		await client_obj.updateOne({ phone },{ used: 1 })

		if (push.phone!==phone) {

			await client_obj.updateOne({ phone: push.phone },{ used: 0 })
		}

		// await cache.set(`pushing_${phone}`,1)

		// const n = cp.fork('client/index.js',{ detached:true })

		// n.send({ phone, action: 'push', data: { text_type, text, caption, media } })

		// n.on('message', async (m) => {

		// 	await cache.del(`pushing_${phone}`)

		// 	if (!m.success||!m.msg) {

		// 		if (m.msg==='PHONE_UNBINDED') {

		// 			await client_obj.updateOne({ phone },{ status: 3 })
				
		// 			await push_obj.updateOne({ phone }, { status: 0 })
		// 		}

		// 		return res.send(m)
		// 	}

		// 	const message_id = m.msg.id

		// 	const from_chat_id = m.msg.chat_id

		// 	try{

		// 		await push_obj.findByIdAndUpdate(_id, { uid, title, chat_type, text_type, phone, chat, text, media, caption, minute, count, message_id, from_chat_id })

		// 		await client_obj.updateOne({ phone },{ used: 1 })

		// 		if (push.phone!==phone) {

		// 			await client_obj.updateOne({ phone: push.phone },{ used: 0 })
		// 		}

		// 	}catch(e){

		// 		return next(new Error(e))
		// 	}

			return res.send({ success: true, msg: '更新服务成功' })
		// })
	},
	change_status: async (req, res, next) => {
	
		const uid = req.user._id

		const _id = req.params._id

		try{

			const push = await push_obj.findOne({ _id, uid })

			if (!push) {

				return res.send({ success: false, msg: '服务不存在' })
			}

			if (push.expire < new Date().getTime()){

				return res.send({ success: false, msg: '服务未购买或已过期' })
			}

			const client = await client_obj.findOne({ uid, phone: push.phone, status: 1 })

			if (!client && !push.status) {

				return res.send({ success: false, msg: '飞机号存在异常，请确认' })
			}

			const add_chat = await add_chat_obj.findOne({ phone: push.phone, status: 0 })

			if (add_chat) {

				return res.send({ success: false, msg: '飞机号正在进行加群服务，暂时不可开启' })
			}

			await push_obj.findByIdAndUpdate(_id, { status: !push.status? 1: 0 })

		}catch(e){

			return next(new Error(e))
		}

		res.send({ success: true, msg: '更新成功' })
	
	},
	del: async (req, res, next) => {
	
		const uid = req.user._id

		const _id = req.params._id

		try{

			const push = await push_obj.findOne({ _id, uid })

			if (!push) {

				return res.send({ success: false, msg: '服务不存在' })
			}

			if (push.expire > new Date().getTime()){

				return res.send({ success: false, msg: '服务未到期，不可删除' })
			}

			await client_obj.updateOne({ phone: push.phone },{ used: 0 })

			await push_obj.deleteOne({ _id, uid })

		}catch(e){

			return next(new Error(e))
		}

		res.send({ success: true, msg: '删除服务成功' })
	
	}
}