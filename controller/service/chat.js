const cp = require('child_process')

const db_chat = require('../../model/schema/chat')

const db_update_chat = require('../../model/schema/update_chat')

const config = require('../../config')

const axios = require('axios')

module.exports = {

	add_chat: async (req, res, next)=>{
	
		let chatname = req.body.chatname

		let type = req.body.type

		let auth = req.body.auth

		const chatbot = config.env.chatbot

		const bot_url = config.bot_url

		chatname = chatname.replace(/(\@|https\:\/\/t\.me\/)+/,'')

		if (!chatname||!chatname.trim()) {

			return res.send({ success: false,msg: '请输入群信息' })
		}

		chatname = chatname.toLowerCase()

		try{

			const exist = await db_chat.findOne({ chatname, type })

			if (exist) {

				return res.send({ success: false,msg: '群信息已存在' })
			}

			const ret = await axios.get(`${bot_url}${chatbot}/getChat?chat_id=@${chatname}`)

			if (!ret.data.ok) {

				return res.send({ success: false,msg: '获取群信息失败' })
			}

			const result = ret.data.result

			if (result.type!=='supergroup') {

				return res.send({ success: false,msg: '该群不是公共群，不能发广告' })
			}

			await db_chat.create({ type, auth, chatid: result.id, chatname: result.username })

			return res.send({ success: true,msg: '群信息添加成功' })

		}catch(err){

			return next(new Error('群信息添加失败'))
		}
	},
	get_chat: async (req, res, next)=>{

		const type = req.params.type?req.params.type:0

		try{

			const data = await db_chat.find({ type, status:1 },{ group: 0, status: 0, _id: 0 })

			return res.send({ success: true, msg: data })

		}catch(err){

			return next(new Error(err))
		
		}
	},
	get_update_chat: async (req, res, next)=>{

		const type = req.params.type?req.params.type:0

		try{

			const data = await db_update_chat.find({ type },{ chatname: 1 })

			return res.send({ success: true, msg: data })

		}catch(err){

			return next(new Error(err))
		
		}
	}
	// get_user_chat: (req, res, next)=>{

	// 	const page = req.params.page

	// 	const limit = req.params.limit

	// 	return res.send({ page, limit })

	// },
}