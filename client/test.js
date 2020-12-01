const Client  = require('../tglib/client')

const config = require('../config')

const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: '601133751860' })

const main = async () => {
	
	try{

		await client_obj.connect('user')

		client_obj.on('updateMessageSendSucceeded',async (res)=>{

			console.log(res)
		})

		client_obj.on('updateNewMessage',async (res)=>{

			console.log(res)
		})

		const { id: chat_id } =  await client_obj.searchPublicChat(config.private_channel)

		await client_obj.sendMessage(chat_id, 'lalala', 'html')

	}catch(err){

		console.log(err)
	}
}

main()