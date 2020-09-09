const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const { add, del, get } = require('../../controller/bots/butler')

router.post('/add', jwt.decode, add)

router.post('/del', jwt.decode, del)

router.post('/get', jwt.decode, get)

module.exports = router