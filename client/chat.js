const db_chat = require('../model/schema/chat')

const axios = require('axios')

const chats = [
	"waimai888",
	"feilvbingmeishijia",
	"wmmsq",
	"TG188",
	"chengshitongqun",
	"Liugezhashuai",
	"manilafoods",
	"Dny_WM",
	"ff55555",
	"meishi001",
	"phlfood",
	"msyhd888",
	"waimai98ejiaoliu",
	"bs16888",
	"niuniuGroup",
	"MeiShiShuo",
	"FoodieInPH",
	"bolems1",
	"FLBWM",
	"LLZP995",
	"foodinph",
	"BC868",
	"hanhan997",
	"YG0014",
	"tlw04",
	"TG2501",
	"wmmspy",
	"FLL85",
	"dingleme",
	"manilawaimai",
	"feileyuanwaimai",
	"makatiwaimaiqun",
	"fw992",
	"Xiangyanbinglangriyongpin"
]

const main = async () => {

	for (var i = chats.length - 1; i >= 0; i--) {
		
		try{

			const ret = await axios.get(`https://api.telegram.org/bot1315874713:AAFVv4mk3tm9QlCoq5tUC4EnHIF955Z1Kbk/getChat?chat_id=@${chats[i]}`)

			if (!ret.data.ok) {

				return res.send({ success: false,msg: '获取群信息失败' })
			}

			const result = ret.data.result

			if (result.type!=='supergroup') {

				console.log(`${chats[i]}: 不是公群`)
			}

			await db_chat.create({ type: 2, auth: 0, chatid: result.id, chatname: result.username, status: 1 })

			console.log(`${chats[i]}: 获取成功`)

		}catch(e){

			console.log(e)
		}
	}

	return 
}

main()