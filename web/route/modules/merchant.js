const express = require('express')
const router = express.Router()

const merchantCtl = require('../../controllers/merchantctl')



router.get('/', merchantCtl.merchantPage)



module.exports = router