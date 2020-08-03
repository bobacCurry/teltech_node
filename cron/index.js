const child_process = require('child_process')

const schedule = require('node-schedule')

const log = require('../controller/common/log')

const db_push = require('../model/schema/push')

const db_queue = require('../model/schema/queue')

const db_add_chat = require('../model/schema/add_chat')

const config = require('../config')

const maxchild = config.env.maxchild

let clear_push_childnum = 0

let join_chat_childnum = 0

let add_push = schedule.scheduleJob('0 * * * * *', async () => {

	const minute = (new Date()).getMinutes()

	try{

		const pushs = await db_push.find({ minute, status: 1 },{ _id: 0,phone:1, chat:1, from_chat_id:1, message_id:1 })

		if (pushs.length) {

			await db_queue.insertMany(pushs)
		}

	}catch(e){

		log.cron_record(e)
	}
})

let clear_push = schedule.scheduleJob('*/7 * * * * *', async (error, stdout, stderr) => {

	if((clear_push_childnum+join_chat_childnum)>=maxchild){

		return 
	}

	clear_push_childnum++

	const clear_push_cron = child_process.fork('cron/clear_push.js',{ detached:true })

	clear_push_cron.on('exit', (code, signal) => {

		clear_push_childnum--

	})
})

let join_chat = schedule.scheduleJob('*/10 * * * * *',async (error, stdout, stderr) => {

	if((clear_push_childnum+join_chat_childnum)>=maxchild){

		return 
	}

	const exec = new Date().getTime()

	const exists = await db_add_chat.exists({ status:0, exec:{ $lt: exec } })

	if (!exists){

		return 
	}

	join_chat_childnum++

	const join_chat_cron = child_process.fork('cron/join_chat.js',{ detached:true })

	join_chat_cron.on('exit', (code, signal) => {

		join_chat_childnum--

	})
})

let reset_push = schedule.scheduleJob('0 0 0 * * *', async () => {

	const now = new Date().getTime()

	try{

		await db_push.updateMany({ expire: { $lt: now }, status: 1 },{status: 0})

	}catch(e){

		log.cron_record(e)
	}
})