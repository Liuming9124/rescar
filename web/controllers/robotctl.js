const db = require("../route/modules/db");
const http = require('http');
const fs = require('fs');

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
    },
    orderGet: (req, res) => {
        var session = db.session()
        var ordertable = []
        session
        .run(`MATCH (n:url)-[orders]->(b:order{status:2}) RETURN n.table, id(b) order by b.time DESC`)
        .then(result => {
            // 依序抓取回傳的節點
            result.records.forEach(record => {
                // console.log(record.get('o').properties)
                let table = record.get('n.table') //  抓取桌號資料
                let orderid = record.get('id(b)').low //  抓取訂單資料
                ordertable.push({table, orderid})
                // console.log(table, orderid)  
                //資料格式: [ { table: '4', orderid: 22 }, { table: '4', orderid: 46 } ]
            })
        })
        .catch(error => {
            console.log('ordertable error:', error)
        })
        .then(() => {
            // console.log('robotctl.js:',ordertable)
            session.close()
            // console.log(ordertable)
            // console.log("ringupdate success")
            res.send(ordertable)
        })
    },
    robotRun: (req, res) => {
            const jsonData = JSON.stringify(req.body);
            // read config.json
            const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
            console.log(config.robotport, config.robotip)
            const options = {
                hostname: config.robotip,
                port: config.robotport,
                path: '/robotRun',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type header for JSON data
                    'Content-Length': jsonData.length // Set the content length header
                }
            };
            const promise = new Promise((resolve, reject) => {
                const request = http.request(options, response => {
                    // console.log(`statusCode: ${response.statusCode}`);
                    let data = '';
                    response.on('data', chunk => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        resolve(data);
                    });
                });
                request.on('error', error => {
                    reject(error);
                });
                request.write(jsonData);
                request.end();
            });
        
            promise.then(data => {
                const word = JSON.parse(data); // extract the word from the response body
                console.log(word);
                res.send(word);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    }
}

module.exports = robotController
