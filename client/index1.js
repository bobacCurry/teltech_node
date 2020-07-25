const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

	try {
	
		await client_obj.connect('user')

		const ret0 = await client_obj.sendMessage(-1001159822763,'11111')

		console.log(ret0)

		let count = 0

		while(true) {

			const ret1 = await client_obj.getChat(-1001159822763)

			console.log(ret1)

		}

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
