const db = require("../route/modules/db");
// var session = db.session()

const qrchooseController = {

    qrchoosePage: (req, res) => {
        res.render('qrchoose')
    }
}

module.exports = qrchooseController
