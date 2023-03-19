const db = require("../route/modules/db");
// var session = db.session()

const orderrecordController = {

    orderrecordPage: (req, res) => {

        res.render('orderrecord',{
            'cusname': '',
            'session': req.session
        })

    }
}

module.exports = orderrecordController
