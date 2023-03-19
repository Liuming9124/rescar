const express = require('express')
const router = express.Router()

const cartCtl = require('../../controllers/cartctl')



router.get('/', cartCtl.cartPage)

router.get('/delcart/:id', (req, res) => {
    // delete the index at id of cart[] array
    const index = req.params.id;
    // console.log('index='+index) 
    
    // chech if index is valid
    if (index >= 0 && index < req.session.cart.length) {
        req.session.cart.splice(index, 1);  // delete cart[id] by function array.splice()
    }
    
    res.redirect('/cart')
});


module.exports = router