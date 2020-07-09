const db_chat = require('../model/schema/chat')

const axios = require('axios')

const chats = [
	"iotaorg",
	"bolepin7",
	"huaxiapinGG888"
]

const main = async () =>{

	for (var i = chats.length - 1; i >= 0; i--) {

		try{
			
			const ret = await axios.get(`https://api.telegram.org/bot1315874713:AAFVv4mk3tm9QlCoq5tUC4EnHIF955Z1Kbk/getChat?chat_id=@${chats[i]}`)
		
			if (!ret.data.ok) {

				console.log(chats[i]+': 获取群信息失败')
			
			}else{
			
				const result = ret.data.result
				
				if (result.type!=='supergroup') {

					console.log(chats[i]+': 该群不是公共群，不能发广告')

					continue
						
				}

				await db_chat.create({ type: 0, auth: 0, chatid: result.id, chatname: result.username })

				console.log(chats[i]+': 导入成功')
				
			}

		}catch(e){

			console.log(chats[i]+': 获取群信息失败')

			continue
		}
	}
}

main()