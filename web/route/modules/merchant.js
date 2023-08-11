const express = require('express')
const router = express.Router()

const merchantCtl = require('../../controllers/merchantctl')



router.get('/',  merchantCtl.merchantPage)
router.get('/qr/:table',merchantCtl.qrgenerate)
router.post('/searchOrder', merchantCtl.searchOrder)
router.get('/updateOrder/:id', merchantCtl.updateOrder)
router.get('/checkoutOrder', merchantCtl.checkoutOrder)
router.get('/getOrderbyTable/:table', merchantCtl.getOrderbyTable)



module.exports = router