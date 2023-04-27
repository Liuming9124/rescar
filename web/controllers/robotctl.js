const db = require("../route/modules/db");
// var session = db.session()

const robotController = {

    robotPage: (req, res) => {
        res.render('robot',{
        })
    },
    robotPlace: (req, res) => {
        console.log((req.body))
        res.send("500")
    }
}

module.exports = robotController
