const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const cache = require('../cache')

const config = require('../config')

main()

const getMe = async (client_obj) => {

	try{

		await client_obj.connect('user')

		const user = await client_obj.getMe()
		
		process.send({ success:true, msg:user})

	}catch(e){

		process.send({ success:false, msg:e.message })
	}
}

const openChat = async (client_obj,chat_id) => {

	try{

		await client_obj.openChat(chat_id)

	}catch(e){

		await client_obj.createPrivateChat(chat_id)
	}

	return
}

const push = async (client_obj,data) => {

	try{

		await client_obj.connect('user')

		const chat = await client_obj.getMe()

		await openChat(client_obj,chat.id)

		let send_ret = ''

		if (data.text_type) {

			const photo = __dirname+'/..'+data.media

			send_ret = await client_obj.sendMedia(chat.id, photo, data.caption)
		
		}else{

			send_ret = await client_obj.sendMessage(chat.id, data.text, 'html')
		}

		let count = 0

		let last_message = null

		while(true) {

			const ret = await client_obj.getChat(chat.id)

			if (!ret.last_message.sending_state) {

				last_message = ret.last_message

				break
			}
			
			count++

			if (count>=50) {

				throw { success: false, msg: '网络延迟严重' }
			}

			await sleep(100)
		}

		process.send({ success: true, msg: last_message })

	}catch(err){
		
		process.send({ success: false, msg: err.message || err.msg })
	
	}
}

async function main() {

	process.on('message', async ({ phone, action = null, data = {} }) => {

		if (!phone) {

			process.send({ success: false,msg: 'NO_MATCHED_PHONE' })

			return 
		}

		if (!action) {

			process.send({ success: false,msg: 'NO_MATCHED_PHONE' })

			return 
		}

		const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone })

	  	switch (action){

	  		case 'getMe':

	  			await getMe(client_obj)

	  			break

	  		case 'push':

	  			await push(client_obj,data)

	  			break

	  		default :

	  			process.send({ success:false,msg:'NO_MATCHED_ACTION' })
	  	}

		await client_obj.close()
		
	})
}