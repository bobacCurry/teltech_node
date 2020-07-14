const db_push = require('../model/schema/push')

const db_client = require('../model/schema/client')

const log = require('../controller/common/log')

const cp = require('child_process')

const get_spam = async () => {

	const now = new Date().getTime()

	try{

		const spam = await db_push.findOne({ expire: { $gt: now }, proxy:1, status: 0 })
	
		if (!spam) {

			return null
		}

		const client = await db_client.findOne({ phone: spam.phone, status: 1 })

		if (client) {

			return null
		}

		return spam
	
	}catch(e){

		console.log(e)

		log.cron_record(`check_push_get_spam: ${e.message?e.message:e}`)

		process.exit(1)
	}
}

const get_client = async () => {

	try{

		const client = await db_client.findOne({ proxy: 1, status: 1, used: 0 })
		
		return client
	
	}catch(e){

		console.log(e)

		log.cron_record(`check_push_get_client: ${e.message?e.message:e}`)

		process.exit(1)
	}
}

const change_client = async (spam, client) => {

	const { _id, text_type, text, caption, media, phone: spam_phone } = spam

	const { phone: client_phone } = client

	const n = cp.fork('client/index.js',{ detached:true })

	n.send({ phone: client_phone, action: 'push', data: { text_type, text, caption, media } })

	n.on('message', async (m) => {

		if (!m.success||!m.msg) {

			if (m.msg==='PHONE_UNBINDED') {

				await client_obj.updateOne({ client_phone },{ status: 3 })
			}

			log.cron_record(`check_push_change_client: ${e.message||e.msg}`)

			process.exit(1)
		}

		const message_id = m.msg.id

		const from_chat_id = m.msg.chat_id

		try{

			await push_obj.findByIdAndUpdate(_id, { client_phone, message_id, from_chat_id })

			await client_obj.updateOne({ client_phone },{ used: 1 })

			await client_obj.updateOne({ spam_phone },{ used: 0 })

		}catch(e){

			log.cron_record(`check_push_change_client: ${e.message?e.message:e}`)

			process.exit(1)
		}

		process.exit(1)
	})

}

const main = async () => {	

	let spam = await get_spam()

	if (!spam) {

		process.exit(1)
	}

	let client = await get_client()

	if (!client) {

		log.cron_record('check_push: 代发号已用尽！')

		process.exit(1)
	}

	await change_client(spam, client)

	process.exit(1)	
}

main()



