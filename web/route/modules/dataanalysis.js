const express = require('express')
const router = express.Router()

const dataanalysisCtl = require('../../controllers/dataanalysisctl')



router.get('/', dataanalysisCtl.dataanalysisPage)
// router.post('/getDataAnalysis', dataanalysisCtl.getDataAnalysis)
router.post('/getUrlCounts', dataanalysisCtl.getUrlCounts)
router.post('/getRevenueSales', dataanalysisCtl.getRevenueSales)
router.post('/getObjectSales',  dataanalysisCtl.getObjectSales)



module.exports = router