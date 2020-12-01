const Client  = require('../tglib/client')

const config = require('../config')

const db_client = require('../model/schema/client')

const db_person = require('../model/schema/person')

const sleep = require('../controller/common/sleep')

const money = require('../controller/account/money')

main()

let count = { success_count: 0, fail_count: 0 }

let sending = false

let spam = false

let msg = '执行完毕'

let success = true

function listenSend(phone, client_obj){

	client_obj.on('updateMessageSendSucceeded',async (res)=>{

		// sending = false

		count.success_count++
	})

	client_obj.on('updateMessageSendFailed',async (res)=>{

		console.log(res.error_message)

		count.fail_count++

		// sending = false

		if(res.error_code&&res.error_code==401){

			await db_client.updateOne({ phone },{ status: 3 })

			success = false

			msg = 'PHONE_UNBINDED'

			spam = true

			// process.send({ success: false, msg: `PHONE_UNBINDED ｜ 成功：${count.success_count}  失败：${count.fail_count}` })

			// await client_obj.close()

		}else if(res.error_message==='USER_BANNED_IN_CHANNEL'||res.error_message==='PEER_FLOOD'){

			await db_client.updateOne({ phone },{ status: 2 })

			success = false

			msg = '号被双向了'

			spam = true

			// process.send({ success: false, msg: `USER_BANNED_IN_CHANNEL ｜ 成功：${count.success_count}  失败：${count.fail_count}` })

			// await client_obj.close()
		
		}else if (res.error_message.indexOf('Too Many Requests: retry after')!==-1) {

			const waiting = res.error_message.replace('Too Many Requests: retry after','')

			success = false

			msg = `发送太快，等待 ${waiting}s`

			spam = true

			// process.send({ success: false, msg: `发送太快，等待 ${waiting}s ｜ 成功：${count.success_count}  失败：${count.fail_count}` })

			// await client_obj.close()
		}
	})
}

async function send(client_obj, target, text, no_admin, send_list, from_chat_id, message_id) {

	for (var i = 0; i < send_list.length; i++) {

		if (spam) {

			break
		}

		try{

			const { id: chat_id } = await client_obj.createPrivateChat(send_list[i])

			await client_obj.forwardMessages(chat_id, from_chat_id, [ message_id ])

			await sleep(300)

		}catch(err){

			throw err
		}
	}

	return
}

async function getChat(client_obj, target, text, no_admin, message_id, send_list) {

	try{

		await client_obj.connect('user')

		const { id, type: { supergroup_id, is_channel } } = await client_obj.searchPublicChat(target)

		if (is_channel) {

			process.send({ success: false, msg: '只有公开群组才能使用此服务' })

			await client_obj.close()
		}

		const { id: from_chat_id } =  await client_obj.searchPublicChat(config.private_channel)

		await send(client_obj, target, text, no_admin, send_list, from_chat_id, message_id)

	}catch(err){

		process.send({ success: false, msg: err.message || err.msg })

		await client_obj.close()
	}

	return
}

async function main() {

	process.on('message', async ({ uid, phone, _id, target, text, no_admin, message_id, send_list, sended_list }) => {

		if (!phone||!target||!text.trim()) {

			process.send({ success: false,msg: '参数缺失' })

			return 
		}

		const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone })

		listenSend(phone, client_obj)

		await getChat(client_obj, target, text, no_admin, message_id, send_list)

		setTimeout(async ()=>{

			await money.inc_money(uid,-count.success_count)

			const sended = send_list.slice(0,count.success_count+count.fail_count)

			send_list = send_list.slice(count.success_count+count.fail_count)

			sended_list = [...sended_list,...sended]

			await db_person.updateOne({ _id },{ send_list, sended_list })

			process.send({ success, msg:`${msg}: 成功：${count.success_count}  失败：${count.fail_count}` })

			await client_obj.close()
		
		},5000)
	})
}