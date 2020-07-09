const db_chat = require('../../model/schema/chat')

module.exports = {
	add_chat : async (req, res, next) => {

		const { _id, auth } = req.params

		try{

			await db_chat.updateOne({ _id },{ status: 1, auth })

			return res.send({ success: true, msg: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	},
	del_chat : async (req, res, next) => {

		const _id  = req.params._id

		try{

			await db_chat.deleteOne({ _id })

			return res.send({ success: true, msg: '删除成功' })

		}catch(err){

			return next(new Error(err))
		}

	},
	get_chat : async (req, res, next) => {

		const page = req.params.page? req.params.page : 1

		const limit = 50 

		const skip = (page-1)*limit

		const { type, status } = req.query

		try{

			const data = await db_chat.find({ type, status }, 'chatid chatname auth group type').limit(limit).skip(skip)

			return res.send({ success: true, msg: data })

		}catch(err){

			return next(new Error(err))
		}		
	}
}