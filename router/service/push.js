const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const push = require('../../controller/service/push')

router.get('/get/:page', jwt.decode, push.get)

router.get('/get_one/:_id', jwt.decode, push.get_one)

router.post('/add', jwt.decode, push.add)

router.post('/update/:_id', jwt.decode, push.update)

router.post('/change_status/:_id', jwt.decode, push.change_status)

router.post('/del/:_id', jwt.decode, push.del)

module.exports = router