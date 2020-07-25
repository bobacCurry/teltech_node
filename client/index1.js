const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

	try {
	
		await client_obj.connect('user')

		const ret = await client_obj.sendMessage(-1001159822763,'11111')

		let count = 0

		while(true) {

			if (count>=10) {
			
				throw { code: 502, msg: '网络延迟严重' }
			
			}

			const ret1 = await client_obj.getChat(-1001159822763)

			if (ret1.last_message.sender_user_id===ret.sender_user_id){

				console.log(ret1,3333333333)

			}else{

				console.log(ret1,4444444444)
			}

			count++

			await sleep(200)

		}

		await client_obj.close()

		// setTimeout(async () => {
		
		// 	await client_obj.close()
			
		// },1000)
		
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
