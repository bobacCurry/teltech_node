const cp = require('child_process')

const cache = require('../../cache')

const db_user = require('../../model/schema/user')

const db_client = require('../../model/schema/client')

const del_dir = require('../common/delDir')

var fs = require('fs')

module.exports = {

	send_code : async (req, res, next) => {

		const phone = req.params.phone

		const uid = req.user._id

		if (!phone) {

			res.send({ success:false, msg:'请输入手机号'})
		}

		const n = cp.fork('client/auth.js',{ detached:true })

		n.send({ phone, action: 'bind' })

		n.on('message', async (m) => {
		  	
		  	if (!m.success) {

		  		return res.send(m)
		  	}

		  	const info = { first_name: m.msg.first_name,username: m.msg.username,id: m.msg.id }

		  	const exist = await db_client.findOne({"phone":phone})

		  	if (!exist) {

		  		await db_client.create({ phone, uid, status:1, info:info })
		  	}

		  	return res.send(m)
		})

		return
	},
	confirm_code : async (req, res, next) => {

		const phone = req.params.phone

		const code = req.params.code

		if (!phone || !code) {

			return res.send({ success:false, msg:'验证信息缺失' })
		}
		
		cache.set(`check_${phone}`,code)

		cache.expire('key',200)

		return res.send({ success:true, msg:'发送成功' })
	},
	logout : async (req, res, next) => {

		const phone = req.params.phone

		const uid = req.user._id

		if (!phone) {

			return res.send({ success:false, msg:'账号信息缺失' })
		}

		const path = __dirname + '/../../.tlg/' + phone

		try{

			if(fs.existsSync(path)) {

				del_dir(path)
			}

			await db_client.deleteOne({ uid, phone })

			return res.send({ success:false, msg:'解除绑定成功' })

		}catch(err){

			return next(new Error(err))
		}
	}
}