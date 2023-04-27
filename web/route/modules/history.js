const express = require('express')
const router = express.Router()

const historyCtl = require('../../controllers/historyctl')



router.get('/', historyCtl.historyPage)



module.exports = router