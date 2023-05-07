const db = require("../route/modules/db");
// var session = db.session()

const robotController = {

    robotPage:async (req, res) => {
        var session = db.session()
        var ringtable = [0,0,0,0,0,0]
        session
        .run(`MATCH (n:url{alert: "1"}) RETURN n.table`)
        .then(result => {
            // 依序抓取回傳的節點
            result.records.forEach(record => {
                // console.log(record.get('o').properties)
                let table = record.get('n.table') //  抓取訂單資料
                ringtable[table-1] = 1
            })
        })
        .catch(error => {
            console.log('ringtable error:', error)
        })
        .then(() => {
            session.close()
            // console.log(ringtable)
            res.render('robot',{
                'ringtable':ringtable
            })
        })
    },
    robotPlace: (req, res) => {
        console.log((req.body))
        res.send("500")
    },
    uncallring: (req, res) => {
        var table = 1
        var session = db.session()
        session
        .run(`MATCH (n:url{table:'${table}',alert:'1'}) set n.alert='0'`)
        .catch(error => { console.log('uncallring error:', error) })
        .then(() => {
            session.close()
            res.redirect('/ring')
        })
    }
}

module.exports = robotController
