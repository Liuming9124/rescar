const express = require('express')
const router = express.Router()

const historyCtl = require('../../controllers/historyctl')



router.get('/', historyCtl.historyPage)
router.post('/historySearch', historyCtl.historySearch)
router.post('/historyCartSearch', historyCtl.historyCartSearch)


module.exports = router