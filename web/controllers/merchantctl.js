const db = require("../route/modules/db");
const qrcode = require('qrcode');
// var session = db.session()


// generate random url
function generateRandomSeed() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let seed = '';
    for (let i = 0; i < 10; i++) {
        seed += chars[Math.floor(Math.random() * chars.length)];
    }
    return seed;
}

const merchantController = {

    merchantPage: (req, res) => {

        res.render('merchant', {
            'cusname': '',
        })
    },
    qrgenerate: async (req, res) => {
        // get QR code
        const seed = generateRandomSeed(); // generate random Seed

        // http
        const url = 'http://localhost:7000/home/' + seed
        // https:
        // const url = 'https://liuming.ddns.net/home/' + seed

        // turn url to qr code, save to local folder
        await qrcode.toFile('./static/qr/' + seed + '.png', url)


        // add seed to db
        var session = db.session()
        session
            .run(`create(n:url{link:'${seed}',time:'${new Date()}',table:'桌號'})`)
            .then(result => {
                // 依序抓取回傳的節點
                result.records.forEach(record => {
                    menu.push({ tname: `${record.get('n.name')}` })
                })
            })
            .catch(error => {
                console.log('add qrUrl error:')
                console.log(error)
            })
            .finally(() => {
                session.close();
                res.send(`<img src="/static/qr/${seed}.png"><br><a href=${url}>前往</a><br> <a href="/merchant">上一頁</a>`); // 将 QR 码发送给客户端
            });
    }
}

module.exports = merchantController
