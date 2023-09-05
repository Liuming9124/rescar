const express = require('express')
const router = express.Router()

const dataanalysisCtl = require('../../controllers/dataanalysisctl')



router.get('/', dataanalysisCtl.dataanalysisPage)
router.post('/getDataAnalysis', dataanalysisCtl.getDataAnalysis)
router.post('/getObjectSales',  dataanalysisCtl.getObjectSales)



module.exports = router