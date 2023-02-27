const express = require('express')
const router = express.Router()


const loginController = require('../../controllers/loginctl.js')



router.get('/', loginController.loginPage)
router.post('/userlogin', loginController.userlogin)




module.exports = router