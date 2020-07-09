const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const user = require('../../controller/admin/user')

router.get('/get_users/:page', jwt.admin, user.get_users)

router.post('/reset_pwd/:_id', jwt.admin, user.reset_pwd)

module.exports = router