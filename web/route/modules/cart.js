const express = require('express')
const router = express.Router()

const cartCtl = require('../../controllers/cartctl')



router.get('/', cartCtl.cartPage)

// router.get('/cart', (req, res) => {
//     // 显示购物车中的商品列表
//     const cart = req.session.cart || [];
//     res.send(cart);
// });



module.exports = router