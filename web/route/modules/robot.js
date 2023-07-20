const express = require('express')
const router = express.Router()

const robotCtl = require('../../controllers/robotctl')


router.get('/', robotCtl.robotPage)
router.post('/place', robotCtl.robotPlace)
router.get('/orderget', robotCtl.orderGet)
router.get('/robotip', (req, res) => {
    res.send({ robotip: config.robotip });
});
router.post('/robotRun', robotCtl.robotRun);


module.exports = router