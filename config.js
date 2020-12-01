const fs = require('fs')

let env = fs.readFileSync('./.env', 'utf-8') // 环境配置

env = JSON.parse(env)

let bot_url = "https://api.telegram.org/bot"

let sms = {

	china:{ api:'http://106.ihuyi.cn/webservice/sms.php?method=Submit', account:'C02526866', password:'17c66358d580fd528cc4fac2314a1c0b' },
	
	naion:{ api:'http://api.isms.ihuyi.com/webservice/isms.php?method=Submit', account:'I47778485', password:'8498c45654e435c53222ba96d9e83c74' }
}

const private_channel = 'private_msg_channel'

module.exports = { env, bot_url, sms, private_channel }