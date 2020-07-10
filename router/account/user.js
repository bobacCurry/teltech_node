const express = require('express')

const router = express.Router()

const account = require('../../controller/account/index.js')

const jwt = require('../../middleware/checkToken')

router.post('/register', jwt.decode, account.register)

router.post('/login', account.login)

router.get('/get_info', jwt.decode, account.get_info)

router.post('/reset_password', jwt.decode, account.reset_password)

router.post('/logout', jwt.decode, account.logout)

module.exports = router