const db = require("../route/modules/db");
// var session = db.session()



const mapController = {

    mapPage: async (req, res) => {
        res.render('map', {
        })
    },
    mapUpload: async (req, res) => {
        var map = req.body
        console.log('receive new maps:', map)
        res.send('{"status": "ok"}')
    }

}

module.exports = mapController
