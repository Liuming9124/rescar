const express = require('express')
const router = express.Router()

const robotCtl = require('../../controllers/robotctl')



router.get('/', robotCtl.robotPage)
router.post('/place', robotCtl.robotPlace)



module.exports = router