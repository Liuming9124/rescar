const express = require('express')
const router = express.Router()

const orderrecordCtl = require('../../controllers/orderrecordctl')



router.get('/', orderrecordCtl.orderrecordPage)



module.exports = router