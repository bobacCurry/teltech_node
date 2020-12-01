const Client  = require('../tglib/client')

const { env, private_channel } = require('../config')

const { sendMessage } = require('../controller/common/tgApi')

main()

let send_list = []

function listenSend(client_obj,chat_id){

	client_obj.on('updateNewMessage',async ({ message })=>{

		if (message.chat_id === chat_id ) {
			
			const message_id = message.id

			process.send({ success: true, msg: { send_list, message_id } })

			await client_obj.close()
		}
	})
}

async function main() {

	process.on('message', async ({ phone, text, target }) => {

		const client_obj = new Client({ apiId: env.apiId, apiHash: env.apiHash, phone })
		
		try{

			await client_obj.connect('user')

			const { id: chat_id } = await client_obj.searchPublicChat(private_channel)

			const { type: { supergroup_id } } = await client_obj.searchPublicChat(target)

			const { total_count, members } = await client_obj.getSupergroupMembers(supergroup_id, 0)

			for (var i = members.length - 1; i >= 0; i--) {

				const { user_id } = members[i]
				
				send_list.push(user_id)
			}

			const circle = Math.ceil(total_count/200) > 3 ? 3 : Math.ceil(total_count/200)

			for (var i = 1; i < circle; i++) {

				let skip = i*200
				
				const { members } = await client_obj.getSupergroupMembers(supergroup_id, skip)

				for (var j = members.length - 1; j >= 0; j--) {

					const { user_id } = members[j]
					
					send_list.push(user_id)
				}
			}

			const ret = await client_obj.joinChat(chat_id)

			if (ret['@type'] === 'ok') {

				listenSend(client_obj,chat_id,text)

				await sendMessage(env.chatbot,{ chat_id, text })
			}

			setTimeout(async ()=>{

				process.send({ success: false, msg: '执行失败，飞机号有问题' })

				await client_obj.close()
			
			},3000)

		}catch(err){

			console.log(err)
			
			process.send({ success: false, msg: '执行失败，飞机号有问题' })

			await client_obj.close()
		}
	})
}