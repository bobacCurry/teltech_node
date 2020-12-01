const db_person = require('../../model/schema/person')

const db_client = require('../../model/schema/client')

const db_user = require('../../model/schema/user.js')

const config = require('../../config')

const chatbot = config.env.chatbot

const private_channel = config.private_channel

const cp = require('child_process')

const { sendMessage, getChat } = require('../common/tgApi')

module.exports = {

	add_person: async (req, res, next)=>{

		const uid = req.user._id
		
		let { target, text, no_admin } = req.body

		if (!target.trim()) {

			return res.send({ success:false, msg:'群名称不得为空' })
		}

		if (!text.trim()) {

			return res.send({ success:false, msg:'发送文案不得为空' })
		}

		target = target.replace('@','')

		target = target.replace('https://t.me/','')

		try{

			const { data } = await getChat(chatbot, { chat_id: `@${target}` })

			if (data.ok&&data.result.type==='channel') {

				return res.send({ success:false, msg: '只能向公开群发送私信' })
			}

			await db_person.create({ uid, target, text, no_admin })

		}catch(err){

			return res.send({ success:false, msg: '群信息不存在' })
		}

		return res.send({ success:true, msg:'保存成功' })
	},
	get_person: async (req, res, next)=>{

		const uid = req.user._id
		
		try{

			const data = await db_person.find({ uid }).limit(10)
			
			return res.send({ success:true, msg: data })

		}catch(err){

			return res.send({ success:false, msg: '数据查询失败' })
		}
	},
	del_person: async (req, res, next)=>{

		const uid = req.user._id

		const _id = req.params._id

		try{

			const person = await db_person.findOne({ _id, uid })

			if (person&&person.phone_list.length) {

				for (var i = person.phone_list.length - 1; i >= 0; i--) {

					await db_client.updateOne({ uid, phone: person.phone_list[i] },{ $set: { used: 0 } })
				}
			}

			await db_person.deleteOne({ _id, uid })
			
			return res.send({ success:true, msg: '数据删除成功' })

		}catch(err){

			return res.send({ success:false, msg: '数据删除失败' })
		}
	},
	add_person_phone: async (req, res, next)=>{

		const uid = req.user._id
		
		let { _id, phone } = req.body

		if (!phone.trim()) {

			return res.send({ success:false, msg:'手机号不得为空' })
		}

		try{

			const client = await db_client.findOne({ uid, phone, used: 0, status: { $in:[ 0, 1 ]} })

			if (!client) {

				return res.send({ success:false, msg: '该手机号不可用' })
			}

			const person = await db_person.findOne({ _id, uid })

			if (!person) {

				return res.send({ success:false, msg: '该服务不存在' })
			}

			if (!person.message_id) {

				// 设置message_id

				const n = cp.fork('client/message.js',{ detached:true })

				n.send({ phone, text: person.text, target: person.target })

				n.on('message', async (m) => {

					if (!m.success) {

						return res.send(m)

					}else{

						const { send_list, message_id } = m.msg

						await db_person.updateOne({ _id, uid },{ $push: { phone_list: phone }, message_id, send_list })
			
						await db_client.updateOne({ uid, phone },{ $set: { used: 1 } })

						return res.send({ success:true, msg: '添加手机号成功' })
					}
				})
			
			}else{

				await db_person.updateOne({ _id, uid },{ $push: { phone_list: phone } })
			
				await db_client.updateOne({ uid, phone },{ $set: { used: 1 } })

				return res.send({ success:true, msg: '添加手机号成功' })
			}

		}catch(err){

			console.log(err)

			return res.send({ success:false, msg: '添加手机号失败' })
		}
	},
	del_person_phone: async (req, res, next)=>{

		const uid = req.user._id

		let { _id, phone } = req.body

		try{

			const client = await db_client.findOne({ uid, phone })

			if (!client) {

				return res.send({ success:false, msg: '该手机号不存在' })
			}

			await db_person.updateOne({ _id, uid },{ $pull: { phone_list: phone } })
			
			await db_client.updateOne({ uid, phone },{ $set: { used: 0 } })

			return res.send({ success:true, msg: '删除手机号成功' })

		}catch(err){

			return res.send({ success:false, msg: '删除手机号失败' })
		}
	},
	send_message: async (req, res, next)=>{
		
		const uid = req.user._id

		const _id = req.params._id

		const phone = req.params.phone

		try{

			const person = await db_person.findOne({ _id, uid })

			if (!person) {

				return res.send({ success:false, msg: '服务不存在' })
			}

			if (!person.send_list.length) {

				return res.send({ success:false, msg: '重制需要发送的用户' })
			}

			const { money } = await db_user.findById(uid)

			if (money<=0) {

				return res.send({ success:false, msg: '金币不足，请充值' })
			}

			const client = await db_client.findOne({ phone, uid, status: { $in:[ 0, 1 ]} })

			if (!client) {

				return res.send({ success:false, msg: '飞机号异常，请检查' })
			}

			const { target, text, no_admin, message_id, send_list, sended_list } = person

			const n = cp.fork('client/person.js',{ detached:true })

			n.send({ uid, phone, _id, target, text, no_admin, message_id, send_list, sended_list })

			n.on('message', async (m) => {

				return res.send(m)
			})
		
		}catch(err){

			console.log(err)

			return res.send({ success:false, msg: '发送失败' })
		}
	}
}