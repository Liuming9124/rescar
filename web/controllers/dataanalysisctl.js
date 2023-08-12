const db = require("../route/modules/db");
// var session = db.session()


const dataanalysisController = {

    dataanalysisPage: (req, res) => {
        res.render('dataanalysis', {
        })
    },
    getDataAnlysis: (req, res) => {
        try {
            // time format operation
            filterTime = req.body
            // console.log(filterTime)
            const sdate = new Date(`${filterTime.startDate}T00:00:00`);
            const stime = sdate.toISOString().slice(0, 19).replace('T', '-').replace(':', '-').replace(':', '-') + '.' + sdate.getMilliseconds() + 'Z';
            // console.log(stime); // 2023-05-17-23-59-00.000Z
            const edate = new Date(`${filterTime.endDate}T23:59:59`);
            const etime = edate.toISOString().slice(0, 19).replace('T', '-').replace(':', '-').replace(':', '-') + '.' + edate.getMilliseconds() + 'Z';
            console.log(etime); // 2023-05-17-23-59-00.000Z

            
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
                    console.log('orderRecord error:', error)
                })
                .then(async () => {
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
                    session.close()
                    console.log(forder)
                    // res.render('history', {
                    //     'forder': forder,
                    //     'time': req.body,  //put searching time into html by variable 'time'
                    // })
                    res.render('dataanalysis', {
                    })
                })
        }
        catch (err) {
            console.log('history time error:', err)
            res.redirect('/dataanalysis')
        }
    }

}



module.exports = dataanalysisController
