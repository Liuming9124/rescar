const db = require("../route/modules/db");
const qrcode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');

// generate random url
async function generateRandomSeed(data) {

    // 要加密的資料
    const plaintext = data;

    // 使用公鑰進行加密
    const ciphertext = crypto.publicEncrypt(
        {
            key: fs.readFileSync('./static/crypto/public-key.pem'),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(plaintext)
    );
    //  將/換成-使網址有辦法解析
    const seed = (ciphertext.toString('base64')).replace(/\//g, '-');
    return seed

}

const merchantController = {

    merchantPage: (req, res) => {
        let morder = []
        session = db.session()
        session
            .run(`match(u:url)-[:order]->(o:order) return (o) order by o.time desc`)
            .then(result => {
                // 依序抓取回傳的節點
                result.records.forEach(record => {
                    // console.log(record.get('o').properties)
                    let orders = record.get('o').properties //  抓取訂單資料
                    let eleID = parseInt(record.get('o').elementId.split(':')[2]);  //  處理ID格式至十進制
                    morder.push({ id: `${eleID}`, info: `${JSON.stringify(orders)}` }) //  將訂單資訊push到morder裡面
                })
            })
            .catch(error => {
                console.log('orderRecord error:', error)
            })
            .then(async () => {
                // console.log(JSON.stringify(morder))   //上一層的所有訂單結果  
                // 使用第二個db連接查詢下一層訂單明細
                var session2 = db.session()
                const temp = morder.length
                for (var i = 0; i < temp; i++) {
                    var carts = []
                    // 查詢特定類別的商品並新增至itemsarr
                    try {
                        const results = await session2.run(`match(o) where ID(o) = ${morder[i].id} match(o) -[:orders]-> (p:cart) return p`);
                        results.records.forEach(record => {
                            // console.log(record.get('p').properties)
                            carts.push(record.get('p').properties);
                        });
                    } catch (error) {
                        console.error(error);
                    }
                    // add items to morder
                    // 為了避免直接修改原始的 morder 數組，先創建一個副本
                    const ordersCp = morder.slice();

                    // 使用 map() 方法更新 morder 數組，將新數據添加到舊數據的末尾
                    morder = ordersCp.map((item, index) => {
                        if (index === i) {
                            return { ...item, cart: carts };
                        } else {
                            return item;
                        }
                    });
                }
                session2.close();
                //  在此return將更新後的資料傳出
                return morder;
            })
            .catch(error => {
                console.log(error)
            })
            .then(() => {
                session.close()
                res.render('merchant', {
                    'orders': morder
                })
            })
    },
    qrgenerate: async (req, res) => {
        // set time
        const now = new Date();
        const cdate = now.toISOString().replace('Z', '+0000').replace(/T|:/g, '-').slice(0, -5) + 'Z';

        // get QR code
        const seedproto = now
        // console.log('seedproto:', seedproto)

        const seed = await generateRandomSeed(seedproto); // generate random Seed

        // http
        const url = 'http://localhost:7000/home/' + seed
        // https:
        // const url = 'https://liuming.ddns.net/home/' + seed

        // turn url to qr code, save to local folder
        await qrcode.toFile('./static/qr/' + cdate + '.png', url)


        // add seed to db
        var session = db.session()

        
        console.log('seed:',seed)
        session
            .run(`create(n:url{link:'${seed}',time:'${cdate}',table:'${req.params.table}'}) return n`)
            .catch(error => {
                console.log('add qrUrl error:')
                console.log(error)
            })
            .finally(() => {
                session.close();
                res.render('qrcode', {
                    'table': req.params.table,
                    'time': cdate,
                    'qr': `/static/qr/${seed}.png`,
                    'qrurl': `${url}`
                })
                // res.send(`<img src="/static/qr/${seed}.png"><br><a href=${url}>前往</a><br> <a href="/merchant">上一頁</a>`); // 将 QR 码发送给客户端
            });
    }
}

module.exports = merchantController
