const express = require('express')
const router = express.Router()

const uploadCtl = require('../../controllers/uploadctl')



router.get('/', uploadCtl.uploadPage)



module.exports = router