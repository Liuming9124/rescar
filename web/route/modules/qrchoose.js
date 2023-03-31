const express = require('express')
const router = express.Router()

const qrchooseCtl = require('../../controllers/qrchoosectl')



router.get('/', qrchooseCtl.qrchoosePage)



module.exports = router