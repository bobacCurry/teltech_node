const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const client = require('../../controller/service/client')

router.post('/add_finish/:phone', jwt.decode, client.add_finish)	

router.get('/get_user_client', jwt.decode, client.get_user_client)

router.post('/del_user_client/:phone', jwt.decode, client.del_user_client)

router.get('/get_notused_client', jwt.decode, client.get_not_used)

router.post('/restore/:phone', jwt.decode, client.restore)

router.get('/get_add_chat/:page', jwt.decode, client.get_add_chat)

module.exports = router