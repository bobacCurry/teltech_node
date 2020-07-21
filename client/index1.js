const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

	try {
	
		await client_obj.connect('user')

		const ret = await client_obj.optimizeStorage()

		console.log(ret)

		setTimeout(async () => {
		
			await client_obj.close()
			
		},1000)

		
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
