const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const order = require('../../controller/service/order')

router.post('/add_order', jwt.decode, order.add_order)

router.get('/get_order/:page/:status', jwt.decode, order.get_order)

router.post('/del_order/:_id', jwt.decode, order.del_order)

module.exports = router