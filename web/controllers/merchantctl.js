const db = require("../route/modules/db");
// var session = db.session()

const merchantController = {

    merchantPage: (req, res) => {

        res.render('merchant',{
            'cusname': '',
            
        })

    }
}

module.exports = merchantController