const express = require('express')
const router = express.Router()

const ringCtl = require('../../controllers/ringctl')



router.get('/', ringCtl.ringPage)



module.exports = router