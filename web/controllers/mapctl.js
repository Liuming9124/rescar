const db = require("../route/modules/db");
// var session = db.session()



const mapController = {

    mapPage: async (req, res) => {
        res.render('map', {
        })
    }
}

module.exports = mapController
