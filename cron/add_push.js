const db_push = require('../model/schema/push')

const db_queue = require('../model/schema/queue')

const main = async () =>{
	
	const pushs = await db_push.find({ },{ _id: 0,phone:1, chat:1, from_chat_id:1, message_id:1 })

	await db_queue.insertMany(pushs)

	process.exit(1)
}

main()