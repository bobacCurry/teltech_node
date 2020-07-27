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

		await client_obj.close()

	}catch(e){

		process.send({ success:false, msg:e.message })

		await client_obj.close()
	}
}

const openChat = async (client_obj,chat_id) => {

	try{

		await client_obj.getChat(chat_id)

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

		if (data.text_type) {

			const photo = __dirname+'/..'+data.media

			await client_obj.sendMedia(chat.id, photo, data.caption)
		
		}else{

			await client_obj.sendMessage(chat.id, data.text, 'html')
		}

		client_obj.on('updateMessageSendSucceeded',async (res)=>{

			if(res.message.chat_id == chat.id){

				process.send({ success: true, msg: res.message })
				
				await client_obj.close()
			}
		})

		client_obj.on('updateMessageSendFailed',async (res)=>{
			
			if(res.message.chat_id == chat.id){

				process.send({ success: true, msg: res.message })
				
				await client_obj.close()
			}
		})		

	}catch(err){
		
		process.send({ success: false, msg: err.message || err.msg })

		await client_obj.close()
	
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

	  			setTimeout(async ()=>{

					await client_obj.close()
				
				})

	  	}
	})
}