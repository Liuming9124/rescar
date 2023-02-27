const express = require('express')
const router = express.Router()

const homeCtl = require('../../controllers/homectl')



router.get('/', homeCtl.homePage)



module.exports = router