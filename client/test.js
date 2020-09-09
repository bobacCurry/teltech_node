const Client  = require('../tglib/client')

const config = require('../config')

const client_obj = new Client({ apiId: config.env.apiId, apiHash: config.env.apiHash, phone: '8613601974603' })

const main = async () => {
	
	try{

		await client_obj.connect('user')

		// const ret = await client_obj.getMe()

		// console.log(ret)

		// const chat = await client_obj.searchPublicChat('ququn_bot')

		client_obj.on('updateMessageContent',async (res)=>{

			console.log(res.new_content.text.entities,111)
		})

		client_obj.on('updateMessageEdited',async (res)=>{

			const data = res.reply_markup.rows[0][1]['type']['data']

			console.log(data,222)

			setTimeout(async ()=>{

				await client_obj.getCallbackQueryAnswer(1136840674,491782144,data)

			},1000)
		})

		await client_obj.getCallbackQueryAnswer(1136840674,491782144,'ODY3Mzc5MTY1LG5leHQsMSzmioDmnK8=')

	}catch(err){

		console.log(err)
	}
}

main()