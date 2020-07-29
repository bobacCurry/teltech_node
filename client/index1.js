const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

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

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
