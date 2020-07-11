const client  = require('../tglib/client')

const log = require('../controller/common/log')

const db_add_chat = require('../model/schema/add_chat')

const db_client = require('../model/schema/client')

const config = require('../config')

const sleep = require('../controller/common/sleep')

const success = async (add_chat) => {

	const chat = add_chat.chatids[0]

	const chatids = add_chat.chatids.slice(1)

	const success = [...add_chat.success,chat]

	let status = 0

	if (!chatids.length) {

		status = 1
	}

	try{

		await db_add_chat.updateOne({ _id: add_chat._id },{ chatids, success, status })
	
	}catch(e){

		throw new Error(e)
	}

	return
}

const fail = async (add_chat) => {

	const chat = add_chat.chatids[0]

	const chatids = add_chat.chatids.slice(1)

	const fail = [...add_chat.fail,chat]

	let status = 0

	if (!chatids.length) {

		status = 1
	}

	try{

		await db_add_chat.updateOne({ _id: add_chat._id },{ chatids, fail, status })
	
	}catch(e){

		throw new Error(e)
	}

	return
}

const unbind = async (add_chat) => {

	try{
		
		await db_add_chat.updateOne({ _id: add_chat._id },{ status: 1 })

		await db_client.updateOne({ phone: add_chat.phone },{ status: 3 })

	}catch(e){

		throw new Error(e)
	}

	return
}

const wait = async (add_chat) =>{

	const exec = new Date().getTime() + 60*2*1000

	try{

		await db_add_chat.updateOne({ _id: add_chat._id },{ exec })
	
	}catch(e){

		throw new Error(e)
	}

	return
}

const main = async () => {

	// 下次加群的时间
	const exec = new Date().getTime()

	const add_chat = await db_add_chat.findOne({ status:0, exec:{ $lt: exec } },'uid phone chatids success fail').sort({'exec':1})

	if (!add_chat) {

		process.exit(1)
	}

	if (!add_chat.chatids.length) {

		await db_add_chat.updateOne({ _id: add_chat._id }, { status: 1 })

		process.exit(1)
	}

	await wait(add_chat)

	const client_obj = new client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: add_chat.phone })

	try {

		await client_obj.connect('user')

		const chat = await client_obj.searchPublicChat(add_chat.chatids[0])

		const ret = await client_obj.joinChat(chat.id)

		if (ret['@type'] === 'ok') {

			await success(add_chat)
		}

	} catch(e) {

		if (e.code === 400) {

			await fail(add_chat)

		}else if (e.code === 401) {

			await unbind(add_chat)
		
		}else if (e.code === 429 || e.code === 420) {

			await wait(add_chat)
		
		}else{

			await fail(add_chat)
		}

		log.cron_record(`join_chat: ${add_chat.phone}${e.message?e.message:e}`)
	}
		
	await client_obj.close()
}

main()