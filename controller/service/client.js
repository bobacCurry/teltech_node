const cp = require('child_process')

const db_chat = require('../../model/schema/chat')

const db_push = require('../../model/schema/push')

const db_client = require('../../model/schema/client')

const db_add_chat =  require('../../model/schema/add_chat')

const del_dir = require('../common/delDir')

var fs = require('fs')

module.exports = {

	add_finish: async (req, res, next)=> {

		const user = req.user

		const phone = req.params.phone

		try{
			
			await db_client.updateOne({ uid: user._id, phone },{ status:1 })

			return res.send({ success: true, msg: '更新成功' })
		
		}catch(err){

			return next(new Error(err))
		}
	},
	get_user_client: async (req, res, next)=>{

		const user = req.user

		try{
			
			data = await db_client.find({"uid":user._id})

			return res.send({ success:true, msg:data })
		
		}catch(err){

			return next(new Error(err))
		}
	},
	del_user_client: async (req, res, next)=>{

		const phone = req.params.phone

		const uid = req.user._id

		try{

			const client = await db_client.findOne({ phone, uid }, '_id')

			if (!client) {

				return res.send({ success: false, 'msg': '实例信息不存在' })
			}

			const push = await db_push.findOne({ phone, status: 1 }, '_id')

			if (push) {

				return res.send({ success: false, 'msg': 'TG账号目前有绑定正在运行的服务，请先停止的服务' })
			} 

			await db_client.deleteOne({ phone, uid })

			const path = __dirname + '/../../.tlg/' + phone

			if(fs.existsSync(path)) {

				del_dir(path)
			}

			return res.send({ success:true, msg:'解除绑定成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_not_used: async (req, res, next)=>{

		const uid = req.user._id

		try{

			const data = await db_client.find({ uid , used: 0, status: 1 })

			return res.send({ success:true, msg:data })

		}catch(err){

			return next(new Error(err))
		}
	},
	restore: async (req, res, next)=>{

		const phone = req.params.phone

		const uid = req.user._id

		try{

			const data = await db_client.updateOne({ phone, uid },{ status: 1 })
		
			return res.send({ success: true, msg: '已恢复' })

		}catch(err){

			return next(new Error(err))
		}
	},
	get_add_chat: async (req, res, next)=>{

		const limit = 50

		const page = req.params.page

		const skip = (page-1)*limit

		const uid = req.user._id

		try{
			
			const data = await db_add_chat.find({ uid })

			return res.send({ success:true, msg:data })
		
		}catch(err){

			return next(new Error(err))
		}
	}
}