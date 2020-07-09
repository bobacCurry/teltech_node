const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const chat = require('../../controller/admin/chat')

router.post('/add_chat/:_id/:auth', jwt.decode, chat.add_chat)

router.post('/del_chat/:_id', jwt.decode, chat.del_chat)

router.get('/get_chat/:page/:limit', jwt.decode, chat.get_chat)

module.exports = router