const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

	try {
	
		await client_obj.connect('user')

		await client_obj.sendMessage(-1001259016381,'11111111')

		let count = 0

		while(true) {

			const ret = await client_obj.getChat(-1001259016381)

			console.log(ret.last_message,1111111111111)

			if (!ret.last_message.sending_state) {

				last_message = ret.last_message

				break
			}

			if (ret.last_message.sending_state&&ret.last_message.sending_state.error_message) {
				
				console.log(ret.last_message.sending_state.error_message,222222222222222)
				
				break
			}
			
			count++

			if (count>=10) {

				throw { success: false, msg: '网络延迟严重' }
			}

			await sleep(200)
		}

		await client_obj.close()

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
