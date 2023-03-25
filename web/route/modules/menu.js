const express = require('express')
const router = express.Router()

const menuCtl = require('../../controllers/menuctl')



router.get('/', menuCtl.menuPage)



module.exports = router