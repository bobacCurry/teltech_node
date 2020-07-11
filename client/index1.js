const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'639665493530' })

	try {
	
		await client_obj.connect('user')

		const ret = await client_obj.getOption('ignore_background_updates')

		console.log(ret)

		await client_obj.close()
		
	
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
