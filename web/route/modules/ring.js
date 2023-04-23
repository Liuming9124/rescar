const express = require('express')
const router = express.Router()

const ringCtl = require('../../controllers/ringctl')



router.get('/', ringCtl.ringPage)
router.get('/callRing', ringCtl.callRing)



module.exports = router