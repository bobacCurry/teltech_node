const child_process = require('child_process')

const schedule = require('node-schedule')

const log = require('../controller/common/log')

const db_push = require('../model/schema/push')

const db_queue = require('../model/schema/queue')

const config = require('../config')

const maxchild = config.env.maxchild

let childnum = 0

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

let clear_push = schedule.scheduleJob('*/5 * * * * *', async (error, stdout, stderr) => {

	if(childnum>=maxchild){

		return 
	}

	childnum++

	const clear_push_cron = child_process.exec('node cron/clear_push.js',{timeout:60000})

	clear_push_cron.on('exit', (code, signal) => {

		childnum--

	})
})

let join_chat = schedule.scheduleJob('*/20 * * * * *',async (error, stdout, stderr) => {

	if(childnum>=maxchild){

		return 
	}

	childnum++

	const join_chat_cron = child_process.exec('node cron/join_chat.js',{timeout:20000})

	join_chat_cron.on('exit', (code, signal) => {

		childnum--

	})
})