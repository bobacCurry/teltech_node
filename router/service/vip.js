const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const vip = require('../../controller/service/vip')

router.post('/add_chat', jwt.decode, vip.add_chat)

router.get('/get_add_chat/:page', jwt.decode, vip.get_add_chat)

router.post('/del_add_chat/:_id', jwt.decode, vip.del_add_chat)

router.post('/update_add_chat/:_id', jwt.decode, vip.update_add_chat)

module.exports = router