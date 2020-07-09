const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'639665493530' })

	try {
	
		await client_obj.connect('user')

		let count = 0

		await client_obj.forwardMessages(-1001270300084,1365358673,[3145728])

		while(true) {

			const ret = await client_obj.getChat(-1001159822763)

			console.log(ret)

			if (ret.last_message&&!ret.last_message.sending_state) {

				break
			}

			count++

			if (count>=10) {

				throw { success: false, msg: '网络延迟严重' }
			}

			await sleep(200)
		}

		setTimeout(async ()=>{

			await client_obj.close()
		
		},1000)
	
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
