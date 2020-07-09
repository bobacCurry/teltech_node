const md5 = require('md5')

const db_user = require('../../model/schema/user.js')

module.exports = {
	
	get_users : async (req, res, next) => {

		const page = req.params.page? req.params.page : 1

		const limit = 50 

		const skip = (page-1)*limit

		try{

			const data = await db_user.find({},'account name job access group status').limit(limit).skip(skip)

			return res.send({ success: true, msg: data })
		
		}catch(err){

			return next(new Error(err))
		}		
	},
	reset_pwd : async (req, res, next) => {

		const _id = req.params._id

		const init_psd = '123qwe'

		try{

			await db_user.findByIdAndUpdate(_id,{ password: md5(init_psd) })

			return res.send({ success: true, msg: '更新成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}