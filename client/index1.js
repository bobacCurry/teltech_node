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

	const spam_id = 178220800

	try {
	
		await client_obj.connect('user')
	
		const chat = await client_obj.createPrivateChat(spam_id)

		await client_obj.sendMessage(spam_id,'/start')		

		client_obj.on('updateNewMessage',async ({message})=>{

			if (message.chat_id == spam_id) {

				console.log(message.content)

				await client_obj.close()
			}
		})

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
