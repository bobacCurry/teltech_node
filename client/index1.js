const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'8613601974603' })

	const photo = __dirname+'/../static/5df6ec8b33988d94a861dfa6_1594561520818.jpeg'

	try {
	
		await client_obj.connect('user')

		const chat = await client_obj.getMe()

		await client_obj.createPrivateChat(chat.id)

		console.log(photo,chat.id)

		const ret = await client_obj.sendMedia(chat.id,photo,'11111111')

		setTimeout(async () => {
		
			await client_obj.close()
			
		},1000)

		
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
