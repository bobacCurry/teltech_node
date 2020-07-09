const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const order = require('../../controller/admin/order')

router.get('/get_order', jwt.decode, order.get_order)

router.post('/start_order/:_id', jwt.decode, order.start_order)

router.post('/del_order/:_id', jwt.decode, order.del_order)

module.exports = router