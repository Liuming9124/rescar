const express = require('express')
const router = express.Router()


const logController = require('../../controllers/logctl.js')



router.post('/userlog', logController.userlog)




module.exports = router