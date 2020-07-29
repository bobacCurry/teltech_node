const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

const phone = process.argv[2]

if (!phone) {

	console.log('没有相应手机号')

	process.exit(1)
}

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone })

	try {
	
		await client_obj.connect('user')
	
		const chat = await client_obj.searchPublicChat('SpamBot')

		await client_obj.sendMessage(chat.id,'/start')		

		client_obj.on('updateNewMessage',async ({message})=>{

			if (message.chat_id == chat.id) {

				console.log(message.content)

				await client_obj.close()
			}
		})

		client_obj.on('updateMessageSendFailed',async ({message})=>{
			
			if(message.chat_id == chat.id){

				console.log(message)
				
			}
		})

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
