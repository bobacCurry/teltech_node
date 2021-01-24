const Client  = require('../tglib/client')

const config = require('../config')

if (!process.argv[2]) {

	console.log('没有输入手机号')

	process.exit(1)
}

const main = async () => {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: process.argv[2] })
	
	try{

		await client_obj.connect('user')

		const chatList = await client_obj.getChats(200)

		console.log(chatList)

		for (var i = 0; i <= chatList.chat_ids.length - 1 ; i++) {
			
			const chat = await client_obj.getChat(chatList.chat_ids[i])
			
			console.log(chat)

			console.log(chat.title,chat.id)

			await client_obj.leaveChat(chat.id)
		}

	}catch(err){

		console.log(err)

		client_obj.close()
	}
}

main()