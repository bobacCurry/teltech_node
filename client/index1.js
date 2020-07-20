const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'8613601974603' })

	try {
	
		await client_obj.connect('user')

		const ret = await client_obj.setOption('use_storage_optimizer',true)

		console.log(ret)

		setTimeout(async () => {
		
			await client_obj.close()
			
		},1000)

		
	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
