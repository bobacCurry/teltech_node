const express = require('express')

const router = express.Router()

const jwt = require('../../middleware/checkToken')

const person = require('../../controller/service/person')

router.post('/add_person', jwt.decode, person.add_person)

router.post('/get_person', jwt.decode, person.get_person)

router.post('/del_person/:_id', jwt.decode, person.del_person)

router.post('/add_person_phone', jwt.decode, person.add_person_phone)

router.post('/del_person_phone', jwt.decode, person.del_person_phone)

router.post('/send_message/:_id/:phone', jwt.decode, person.send_message)

module.exports = router