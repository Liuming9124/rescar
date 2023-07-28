const express = require('express')
const router = express.Router()

const mapCtl = require('../../controllers/mapctl')



router.get('/', mapCtl.mapPage)

module.exports = router