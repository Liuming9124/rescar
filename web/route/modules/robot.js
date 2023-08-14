const express = require('express')
const router = express.Router()

const robotCtl = require('../../controllers/robotctl')


router.get('/', robotCtl.robotPage)
router.post('/place', robotCtl.robotPlace)
router.get('/orderget', robotCtl.orderGet)
router.post('/robotRun', robotCtl.robotRun);
router.post('/robotCounter', robotCtl.robotCounter)
router.get('/robotStatus', robotCtl.robotStatus)


module.exports = router