const client  = require('../tglib/client')

const log = require('../controller/common/log')

const db_push = require('../model/schema/push')

const db_queue = require('../model/schema/queue')

const db_client = require('../model/schema/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

const cache = require('../cache')

const send = async (client_obj, queue) => {

	let fail = []

	for (var i = queue.chat.length - 1; i >= 0; i--) {

		try{

			await client_obj.forwardMessages(queue.chat[i].chatid, queue.from_chat_id, queue.message_id)
		
		}catch(e){

			if (e.code===5) {

				try {

					await client_obj.searchPublicChat(queue.chat[i].chatname)
				
				}catch(e){

					fail.push(queue.chat[i].chatid)
						
				}
			
			}else if(e.code===400||e.code===403||e.code===406){

				fail.push(queue.chat[i].chatid)

			}else{

				throw e
			}
		}
	}
	
	return fail 
}

const unbind = async (phone) => {
		
	await db_push.updateOne({ phone },{ status: 0 })

	await db_client.updateOne({ phone },{ status: 3 })

	return
}

const spamed = async (phone) => {
		
	await db_push.updateOne({ phone },{ status: 0 })

	await db_client.updateOne({ phone },{ status: 2 })

	return
}

const main = async () => {

	const queue = await db_queue.findOne({})

	if (!queue) {

		process.exit(1)
	}

	await db_queue.deleteOne({ phone: queue.phone })

	if (!queue.chat.length){

		await db_push.updateOne({ phone: queue.phone },{ status: 0 })

		process.exit(1)
	}

	const client_obj = new client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: queue.phone })

	try {

		await client_obj.connect('user')

		client_obj.on('updateMessageSendFailed',async (res)=>{

			let code = res.error_code

			let message = res.error_message

			if (code === 401) {

				log.cron_record(`clear_push: ${code} ${queue.phone}: ${message}`)

				await unbind(queue.phone)

				await client_obj.close()

			}else if(message==='USER_BANNED_IN_CHANNEL'){

				log.cron_record(`clear_push: ${code} ${queue.phone}: ${message}`)

				await spamed(queue.phone)

				await client_obj.close()

			}else{

				log.cron_record(`clear_push: ${code} ${queue.phone}: ${message}`)
			}
		})

		const fail = await send(client_obj, queue)

		if (fail.length) {

			await db_push.updateOne({ phone: queue.phone }, { $pull: { chat: { chatid: {$in: fail } } } })
		}

	}catch(e){

		if (e.code === 401) {

			await unbind(queue.phone)
		}

		log.cron_record(`clear_push: ${queue.phone}: ${e.code} ${e.msg?e.msg:e.message}`)

		await client_obj.close()
	}

	setTimeout(async ()=>{

		await client_obj.close()
	
	},40000)
}

main()