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

		client_obj.on('updateNewMessage',async (res)=>{

			const { message } = res

			if (message.chat_id === 777000) {

				console.log(message)
			}
		})

	}catch(err){

		console.log(err)

		client_obj.close()
	}
}

main()