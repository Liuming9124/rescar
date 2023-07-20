const express = require('express')
const router = express.Router()

const robotCtl = require('../../controllers/robotctl')
const fs = require('fs');
// read config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));



router.get('/', robotCtl.robotPage)
router.post('/place', robotCtl.robotPlace)
router.get('/orderget', robotCtl.orderGet)
router.get('/robotip', (req, res) => {
    res.send({ robotip: config.robotip });
});
router.post('/robotRun', robotCtl.robotRun);


module.exports = router