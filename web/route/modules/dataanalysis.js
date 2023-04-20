const express = require('express')
const router = express.Router()

const dataanalysisCtl = require('../../controllers/dataanalysisctl')



router.get('/', dataanalysisCtl.dataanalysisPage)



module.exports = router