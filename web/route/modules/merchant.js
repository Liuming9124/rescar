const express = require('express')
const router = express.Router()

const merchantCtl = require('../../controllers/merchantctl')



router.get('/',  merchantCtl.merchantPage)
router.get('/qr/:table',merchantCtl.qrgenerate)
router.post('/searchOrder', merchantCtl.searchOrder)



module.exports = router