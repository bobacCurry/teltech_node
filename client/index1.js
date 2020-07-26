const Client  = require('../tglib/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

main()

async function main() {

	const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone:'601133751860' })

	try {
	
		await client_obj.connect('user')

		const msgids = [1,2,3,4,5]

		for (var i = msgids.length - 1; i >= 0; i--) {

			console.log(i)

			try{
			
				await client_obj.forwardMessages(-10012590163821,601424972,[132115333121])
			
			}catch(e){

				console.log(e)
			}
		}

		client_obj.on('updateMessageSendFailed',(data)=>{

			console.log(data,11111)
			
		})

		setTimeout(async ()=>{

			await client_obj.close()
		
		},3000)

	} catch(e) {
	
		console.log('ERROR', e)
	
		await client_obj.close()
	}
}
