const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const file = require('../../controller/common/file')

// const sms = require('../../controller/common/sms')

// router.post('/send_sms', sms.send_sms) // 发送验证码

router.post('/upload_image', jwt.decode, file.upload_file) // 上传文件

module.exports = router