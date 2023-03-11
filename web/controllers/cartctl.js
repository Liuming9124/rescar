const db = require("../route/modules/db");
// var session = db.session()

const cartController = {

    cartPage: (req, res) => {

        res.render('cart',{
            'cusname': '',
            
        })

    }
}

module.exports = cartController
