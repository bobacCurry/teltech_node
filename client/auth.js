const Client  = require('../tglib/auth_client.js')

const cache = require('../cache')

const config = require('../config')

main()

const bind = async (client_obj,phone) => {

	try{

		await cache.del(`check_${phone}`)

		await client_obj.connect('user')

		const user = await client_obj.getMe()

		process.send({ success:true, msg:user })

	}catch(e){

		process.send({ success:false, msg:e.message })
		
	}
}

async function main() {

	process.on('message', async ({ phone, action = null, data = null }) => {

		if (!phone) {

			process.send({ success:false,msg:'NO_MATCHED_PHONE' })

			return 
		}

		if (!action) {

			process.send({ success:false,msg:'NO_MATCHED_PHONE' })

			return 
		}

		const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone })

	  	switch (action){

	  		case 'bind':

	  			await bind(client_obj,phone)

	  			break

	  		default :

	  			process.send({ success:false,msg:'NO_MATCHED_ACTION' })
	  	}

	  	await client_obj.close()
	})
}