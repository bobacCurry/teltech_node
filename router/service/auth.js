const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const auth = require('../../controller/service/auth')

router.post('/send_code/:phone', jwt.decode, auth.send_code)

router.post('/confirm_code/:phone/:code', jwt.decode, auth.confirm_code)

router.post('/logout/:phone', jwt.decode, auth.logout)

module.exports = router