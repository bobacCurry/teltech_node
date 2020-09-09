const config = require('../../config.js')

const botapi = config.env.botapi

const axios = require('axios')

module.exports = {

	add: async (req, res, next) =>{

		const { chatname, keywords, greet, warning, limit } = req.body

		const uid = req.user._id

		if(!chatname||!chatname.trim()){

			return res.send({ success: false, msg: '群名称不得为空' })
		}

		let chatname_filter = chatname

		chatname_filter = chatname_filter.replace('@','')

		chatname_filter = chatname_filter.replace('https://t.me/','')

		try{

			const { data } = await axios.post(`${botapi}/butler/add`,{ ...req.body, uid, chatname: chatname_filter, brand:'yabo' })
		
		}catch(e){

			return res.send({ success: false, msg: '添加机器人失败' })
		}

		return res.send({ success: true, msg: '添加机器人设置成功' })

	},
	del: async (req, res, next) =>{

		const uid = req.user._id

		const { _id } = req.body

		try{

			const { data } = await axios.post(`${botapi}/butler/del`,{ _id })
			
			return res.send(data)
		
		}catch(e){

			return res.send({ success: false, msg: '删除机器人失败' })
		}

	},
	get: async (req, res, next) =>{

		const uid = req.user._id

		const { page } = req.body

		let butlers = []

		try{

			const { data } = await axios.post(`${botapi}/butler/get`,{ page, uid, brand:'yabo' })
		
			if(data.success){

				butlers = data.msg
			}

		}catch(e){

			return res.send({ success: false, msg: [] })
		}

		return res.send({ success: true, msg: butlers })
		
	}
}