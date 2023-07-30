const express = require('express')
const router = express.Router()

const mapCtl = require('../../controllers/mapctl')



router.get('/', mapCtl.mapPage)
router.post('/upload', mapCtl.mapUpload)

module.exports = router