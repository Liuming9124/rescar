const express = require('express')
const router = express.Router()

const dataanalysisCtl = require('../../controllers/dataanalysisctl')



router.get('/', dataanalysisCtl.dataanalysisPage)
router.post('/getDataAnlysis', dataanalysisCtl.getDataAnlysis)



module.exports = router