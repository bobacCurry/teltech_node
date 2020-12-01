const db_chat = require('../model/schema/chat')

const axios = require('axios')

const config = require('../config')

const chatbot = config.env.chatbot

const bot_url = config.bot_url

const chats = [
	"xXx369",
	"qiu440",
	"feihu886",
	"yesuzhuroupu",
	"TG021",
	"TG128",
	"aquanV5",
	"TGG88888",
	"anwei3",
	"sdynews",
	"diguo1",
	"idc9999",
	"jucan924",
	"bocaizpcom",
	"TG815",
	"TG5214",
	"bianmin1",
	"HWC689",
	"gdgsd33",
	"jpz520",
	"TG550",
	"STQJ5Fby9H",
	"meosjzk",
	"JRTT1"
]

const add_chat = async (name,type,auth) => {

	let chatname = name.toLowerCase()

	console.log('开始添加群----：'+chatname)

	try{

		const exist = await db_chat.findOne({ chatname, type })

		if (exist) {

			console.log('群信息已存在')
		}

		const ret = await axios.get(`${bot_url}${chatbot}/getChat?chat_id=@${chatname}`)

		if (!ret.data.ok) {

			console.log('获取群信息失败')
		}

		const result = ret.data.result

		if (result.type!=='supergroup') {

			console.log('该群不是公共群，不能发广告')
		}

		await db_chat.create({ type, auth, chatid: result.id, chatname: chatname, status: 1 })

		console.log('群信息添加成功：'+chatname)

	}catch({ response }){

		console.log(response.data)
	}
}

const main = async () => {

	for(let i = 0; i < chats.length; i++){

		await add_chat(chats[i],4,0)
	}
}

main()