const express = require('express')
const router = express.Router()

const ringCtl = require('../../controllers/ringctl')



router.get('/', ringCtl.ringPage)
router.get('/callRing', ringCtl.callRing)
router.get('/ringupdate', ringCtl.ringupdate)
router.get('/uncallring', ringCtl.uncallring)



module.exports = router