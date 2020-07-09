const client  = require('../tglib/client')

const log = require('../controller/common/log')

const db_push = require('../model/schema/push')

const db_queue = require('../model/schema/queue')

const db_client = require('../model/schema/client')

const sleep = require('../controller/common/sleep')

const config = require('../config')

const send = async (client_obj, queue) => {

	let fail = []

	let spam = 1

	for (var i = queue.chat.length - 1; i >= 0; i--) {

		try{

			await client_obj.forwardMessages(queue.chat[i].chatid, queue.from_chat_id, [queue.message_id])

			if (spam) {

				let count = 0

				while(true) {

					const ret = await client_obj.getChat(queue.chat[i].chatid)

					if (ret.last_message&&ret.last_message.sending_state&&ret.last_message.sending_state.error_message==='USER_BANNED_IN_CHANNEL') {

						throw {code: 400, msg: 'USER_BANNED_IN_CHANNEL'}

						break
					}

					if (ret.last_message&&!ret.last_message.sending_state) {

						spam = 0

						break
					}

					count++

					if (count>=20) {

						throw { code: 502, msg: '网络延迟严重' }
					}

					await sleep(200)
				}
			}

		}catch(e){

			if (e.code===5) {

				await client_obj.searchPublicChat(queue.chat[i].chatname)
			
			}else if(e.code===400&&e.msg==='USER_BANNED_IN_CHANNEL'){

				throw e

			}else if(e.code===502){

				throw e

			}else{

				fail.push(queue.chat[i].chatid)
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

	const client_obj = new client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: queue.phone })

	try {

		await client_obj.connect('user')

		const fail = await send(client_obj, queue)

		if (fail.length) {

			await db_push.updateOne({ phone: queue.phone }, { $pull: { chat: { chatid: {$in: fail } } } })
		}

	}catch(e){
		
		if (e.code === 401) {

			await unbind(queue.phone)

		}else if(e.code===400&&e.msg==='USER_BANNED_IN_CHANNEL'){

			await spamed(queue.phone)
		}

		log.cron_record(`${queue.phone}: ${e.msg}`)

	}finally{

		setTimeout(async ()=>{

			await client_obj.close()

		},3000)
	}
}

main()