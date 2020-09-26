const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const chat = require('../../controller/service/chat')

router.post('/add_chat', jwt.decode, chat.add_chat)

router.get('/get_chat/:type', jwt.decode, chat.get_chat)

router.get('/get_update_chat/:type', jwt.decode, chat.get_update_chat)

// router.post('/get_user_chat/:page/:limit', jwt.decode, chat.add_chat)

module.exports = router