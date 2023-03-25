const db = require("../route/modules/db");
// var session = db.session()

const qrcodeController = {

    qrcodePage: (req, res) => {

        res.render('qrcode',{
        })

    }
}

module.exports = qrcodeController
