const db = require("../route/modules/db");
const funCtl = require("../route/modules/fun");

// var session = db.session()


const dataanalysisController = {

    dataanalysisPage: (req, res) => {
        res.render('dataanalysis', {
        })
    },
    getDataAnalysis: (req, res) => {
        console.log(req.body)
        try {
            // // time format operation
            // filterTime = req.body
            // // console.log(filterTime)
            // const sdate = new Date(`${filterTime.startDate}T00:00:00`);
            // const stime = sdate.toISOString().slice(0, 19).replace('T', '-').replace(':', '-').replace(':', '-') + '.' + sdate.getMilliseconds() + 'Z';
            // // console.log(stime); // 2023-05-17-23-59-00.000Z
            // const edate = new Date(`${filterTime.endDate}T23:59:59`);
            // const etime = edate.toISOString().slice(0, 19).replace('T', '-').replace(':', '-').replace(':', '-') + '.' + edate.getMilliseconds() + 'Z';
            // console.log(etime); // 2023-05-17-23-59-00.000Z

            stime = `2023-05-17-23-59-00.000Z`
            etime = `2023-12-17-23-59-00.000Z`

            
            let forder = []
            session = db.session()
            session
                .run(`MATCH (o:order) WHERE o.time >= ('${stime}') AND o.time < ('${etime}') RETURN (o) order by o.time desc`)
                .then(result => {
                    // 依序抓取回傳的節點
                    result.records.forEach(record => {
                        // console.log(record.get('o').properties)
                        let sorder = record.get('o').properties //  抓取訂單資料
                        let eleID = parseInt(record.get('o').elementId.split(':')[2]);  //  處理ID格式至十進制
                        forder.push({ id: `${eleID}`, info: `${JSON.stringify(sorder)}` }) //  將訂單資訊push到forder裡面
                    })
                })
                .catch(error => {
                    res.send(`{"status":"${error}"}}`)
                })
                .then(async () => {
                    var menu = []
                    menu = JSON.parse(await funCtl.getMenu())
                    //console.log('menu:',menu)
                    var food = {}; // 創建一個空物件來存儲菜單數據

                    for (var i = 0; i < menu.length; i++) {
                        var category = menu[i].name; // 獲取類別名稱
                        var items = menu[i].items;   // 獲取食物項目數組
                        food[category] = {}; // 在food物件中創建一個空物件來存儲當前類別的食物項目
                        for (var j = 0; j < items.length; j++) {
                          food[category][j + 1] = { name: items[j].name, count: 0 }; // 將食物項目添加到當前類別下，注意這裡的 j + 1 作為食物項目的編號
                        }
                      }
                      
                      console.log('menu:',food);

                    // console.log(JSON.stringify(forder))   //上一層的所有訂單結果  
                    // 使用第二個db連接查詢下一層訂單明細
                    var session2 = db.session()
                    const temp = forder.length
                    for (var i = 0; i < temp; i++) {
                        var carts = []
                        // 查詢特定類別的商品並新增至itemsarr
                        try {
                            const results = await session2.run(`match(o) where ID(o) = ${forder[i].id} match(o) -[:orders]-> (p:cart) return p`);
                            results.records.forEach(record => {
                                // console.log(record.get('p').properties)
                                carts.push(record.get('p').properties);
                            });
                        } catch (error) {
                            console.error(error);
                        }
                        // add items to forder
                        // 為了避免直接修改原始的 forder 數組，先創建一個副本
                        const ordersCp = forder.slice();

                        // 使用 map() 方法更新 forder 數組，將新數據添加到舊數據的末尾
                        forder = ordersCp.map((item, index) => {
                            if (index === i) {
                                return { ...item, cart: carts };
                            } else {
                                return item;
                            }
                        });
                    }
                    session2.close();
                    //  在此return將更新後的資料傳出
                    return forder;
                })
                .catch(error => {
                    console.log(error)
                })
                .then(() => {
                    var session3 = db.session()
                    try {
                        const result3 =session3.run(`MATCH (n:type) RETURN n LIMIT 25`);
                        console.log(result3);
                    } catch (error) {
                        console.error(error);
                    }    
                    
                })
                .then(() => {
                    session.close()
                    console.log(forder)
                    res.send(JSON.stringify(forder))
                })
        }
        catch (err) {
            console.log('history time error:', err)
            res.redirect('/dataanalysis')
        }
    }

}



module.exports = dataanalysisController
