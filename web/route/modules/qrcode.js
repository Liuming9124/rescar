const express = require('express')
const router = express.Router()

const qrcodeCtl = require('../../controllers/qrcodectl')



router.get('/', qrcodeCtl.qrcodePage)



module.exports = router