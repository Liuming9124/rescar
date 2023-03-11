const express = require('express')
const router = express.Router()

const cartCtl = require('../../controllers/cartctl')



router.get('/', cartCtl.cartPage)



module.exports = router