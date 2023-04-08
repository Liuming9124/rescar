const express = require('express')
const router = express.Router()

const merchinfoCtl = require('../../controllers/merchinfoctl')



router.get('/', merchinfoCtl.merchinfoPage)



module.exports = router