const db = require("../route/modules/db");
// var session = db.session()

const orderrecordController = {

    orderrecordPage: (req, res) => {
        let ordershow = []
        session = db.session()
        session
        .run(`match(u:url{link:'${req.session.seed}'})-[:order]->(o:order)    return (o) ORDER BY o.time DESC`)
        .then(result => {
            // 依序抓取回傳的節點
            result.records.forEach(record => {
                console.log(record.get('o').properties)
                let orders = record.get('o').properties //  抓取訂單資料
                let eleID = parseInt(record.get('o').elementId.split(':')[2]);  //  處理ID格式至十進制
                ordershow.push({ id:`${eleID}`, info: `${JSON.stringify(orders)}`}) //  將訂單資訊push到ordershow裡面
                // console.log(record.get('o'))
                // console.log(orders)
                // console.log('ele:',eleID)
            })
        })
        .catch(error => {
            console.log('orderRecord error:', error)
        })
        .then(async () => {
            console.log(ordershow)   //上一層的所有訂單結果
            // 使用第二個db連接查詢下一層訂單明細
            var session2 = db.session()
            const temp = ordershow.length
            for (var i = 0; i < temp; i++) {
                var carts = []
                // 查詢特定類別的商品並新增至itemsarr
                try {
                    const results = await session2.run(`match(o) where ID(o) = ${ordershow[i].id} match(o) -[:orders]-> (p:cart) return p`);
                    results.records.forEach(record => {
                        // console.log(record.get('p').properties)
                        carts.push(record.get('p').properties);
                    });
                } catch (error) {
                    console.error(error);
                }
                // add items to ordershow
                // 為了避免直接修改原始的 ordershow 數組，先創建一個副本
                const ordersCp = ordershow.slice();

                // 使用 map() 方法更新 ordershow 數組，將新數據添加到舊數據的末尾
                ordershow = ordersCp.map((item, index) => {
                    if (index === i) {
                        return { ...item, cart: carts };
                    } else {
                        return item;
                    }
                });
            }
            session2.close();
            //  在此return將更新後的資料傳出
            return ordershow;
        })
        .catch(error => {
            console.log(error)
        })
        .then(() => {
            //console.log('orders:',ordershow)
            //console.log('ordertime:'  ,JSON.parse(ordershow[0].info.replace(/'/g, "\"")).time)
            //console.log('orderstatus:',JSON.parse(ordershow[0].info.replace(/'/g, "\"")).status)
            //console.log(ordershow[3].cart[0])
            //console.log(ordershow[3].cart[0].price)
            //console.log(ordershow[3].cart[0].name)
            //console.log(ordershow[3].cart[0].amt)

            session.close()
            res.render('orderrecord',{
                'orders': ordershow,
                'session': req.session
            })
        })

    }
}

module.exports = orderrecordController
