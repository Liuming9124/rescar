const db = require("../route/modules/db");


// var session = db.session()

const loginController = {

    loginPage: (req, res) => {
        res.render('login',{
            'loginstatus':''
        });
    },
    userlogin: (req, res) => {
        var user = req.body;
        var show
        session = db.session()  
        session
        .run('match (n:boss{account: $acc ,password: $pas }) return n', {
            acc:user.username,
            pas:user.password
        })
        .then(result => {
            console.log(result.records)
            const singleRecord = result.records[0]
            const node = singleRecord.get(0)
            // result.records.forEach(record => {
            //     console.log(record.get('account'))
            //     show = record.get('account')
            // })
            
            show = node.properties.account
            console.log(node.properties.account)
            if (user.username==node.properties.account) {
                req.session.userName = user.username; // 登入成功，設定 session
                res.redirect('/home')
            }
            
        })
        .catch(error => {
            console.log(error)
            res.render('login',{
                loginstatus:'錯誤的帳號或密碼'
            })
        })
        .then(() => session.close())
    }
}

module.exports = loginController
