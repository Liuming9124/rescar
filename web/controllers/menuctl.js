const db = require("../route/modules/db");
const funCtl = require("../route/modules/fun");
// var session = db.session()

const menuController = {

    menuPage: async (req, res) => {
        
        // 需要印出的變數->menu
        var menu = []
        menu = JSON.parse(await funCtl.getMenu())
        console.log('menu:',menu)
        console.log(menu.length)
        
        res.render('menu', {
            'menu': menu
        });
    }
}

module.exports = menuController
