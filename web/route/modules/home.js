const express = require('express')
const router = express.Router()

const homeCtl = require('../../controllers/homectl')



router.get('/', homeCtl.homePage)
router.get('/:url', homeCtl.homePage)
router.post('/addcart', (req, res) => {
    // get product data
    // console.log('token'+ JSON.parse(req.body.token))
    var product = req.body;

    // add product into cart
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(product);
    res.redirect(`/home/${req.session.seed}`)
});


module.exports = router