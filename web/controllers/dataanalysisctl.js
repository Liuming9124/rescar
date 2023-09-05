const db = require("../route/modules/db");
const funCtl = require("../route/modules/fun");


function convertToValidDateString(timeString) {
    const parts = timeString.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
    const day = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const second = parseInt(parts[5].split(".")[0]);
    const millisecond = parseInt(parts[5].split(".")[1].replace("Z", ""));
    const date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
    return date
}

function getrevenueByYearMonth(forder) {
    const revenueByYearMonth = {};
    forder.forEach(item => {
        const info = JSON.parse(item.info);
        const time = convertToValidDateString(info.time);
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const revenue = item.cart.reduce((sum, cartItem) => sum + (parseFloat(cartItem.price) * parseInt(cartItem.amt)), 0);

        const yearMonthKey = `${year}-${month}`;
        if (!revenueByYearMonth[yearMonthKey]) {
            revenueByYearMonth[yearMonthKey] = revenue;
        } else {
            revenueByYearMonth[yearMonthKey] += revenue;
        }
    });
    return revenueByYearMonth;
}

function countUniqueUrlids(data) {
    const urlids = new Set();
    for (const item of data) {
        const urlid = item.urlid;
        urlids.add(urlid);
    }
    return urlids.size;
}

async function getSalesData(data, period) {
    // 初始化銷售量物件
    const sales = {};

    // 遍歷資料進行統計
    data.forEach((item) => {
        const salesData = {};

        const info = JSON.parse(item.info);
        const time = convertToValidDateString(info.time);
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const day = time.getDate();
        console.log(year, month, day)

        let ptime;
        if (period === "year") {
            ptime = `${year}`;
        } else if (period === "season"){
            if (month <= 3) {
                ptime = `${year}-1`;
            } else if (month <= 6) {
                ptime = `${year}-2`;
            } else if (month <= 9) {
                ptime = `${year}-3`;
            } else if (month <= 12) {
                ptime = `${year}-4`;
            }
        } else if (period === "month") {
            ptime = `${year}-${month}`;
        } else if (period === "day") {
            ptime = `${year}-${month}-${day}`;
        }
        const cart = item.cart;

        cart.forEach((product) => {
            const name = product.name;
            const amount = parseInt(product.amt);

            // 紀錄銷售量
            salesData[name] = amount;
        });
        console.log(salesData)

        // 查詢salesData中是否已經有該時間段的資料，並將相同產品的銷售量相加
        if (sales.hasOwnProperty(ptime)) {
            // 時間段已存在於銷售量物件中
            const existingSalesData = sales[ptime];
            for (const name in salesData) {
                if (existingSalesData.hasOwnProperty(name)) {
                    // 相同產品已存在於該時間段的銷售量中，將銷售量相加
                    existingSalesData[name] += salesData[name];
                } else {
                    // 相同產品不存在於該時間段的銷售量中，直接加入銷售量物件
                    existingSalesData[name] = salesData[name];
                }
            }
        } else {
            // 時間段不存在於銷售量物件中，新增該時間段的銷售量物件
            sales[ptime] = salesData;
        }
    });

    return sales;
}

async function getdatabytime(stime, etime) {
    try {
        let forder = []
        session = db.session()
        await session
            .run(`MATCH (o:order) WHERE o.time >= ('${stime}') AND o.time < ('${etime}') match(n:url)-[:order]->(o) RETURN n,o order by o.time desc`)
            .then(result => {
                // 依序抓取回傳的節點
                result.records.forEach(record => {
                    // console.log(record.get('o').properties)
                    let url = record.get('n').properties
                    let urlid = parseInt(record.get('n').elementId.split(':')[2]);  //  處理ID格式至十進制
                    let sorder = record.get('o').properties //  抓取訂單資料
                    let eleID = parseInt(record.get('o').elementId.split(':')[2]);  //  處理ID格式至十進制
                    forder.push({ urlid: `${urlid}`, urltime: `${url.time}`, id: `${eleID}`, info: `${JSON.stringify(sorder)}` }) //  將訂單資訊push到forder裡面
                })
            })
            .catch(error => {
                res.send(`{"status":"${error}"}}`)
            })
            .then(async () => {
                var session2 = db.session()
                var i = 0
                for await (let temp of forder) {
                    var carts = []
                    // 查詢特定類別的商品並新增至itemsarr
                    try {
                        // console.log('id',temp)
                        await session2
                            .run(`match(o) where ID(o) = ${temp.id} match(o) -[:orders]-> (p:cart) return p`)
                            .then(result => {
                                result.records.forEach(record => {
                                    // console.log(record.get('p').properties)
                                    carts.push(record.get('p').properties);
                                })
                            })
                            .catch(error => {
                                console.error(error);
                            })
                            .then(() => {
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
                            })
                    } catch (error) {
                        console.error(error);
                    }
                    i++
                    // console.log(i)
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
                // console.log(forder)
            })
            .finally(() => {
                target = forder;
            });

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(target);
            }, 0);
        });
    }
    catch (err) {
        console.log('getDataAnalysis error:', err)
    }
}
async function getFormatMenu() {
    // var menu = []
    // menu = JSON.parse(await funCtl.getMenu())
    // //console.log('menu:',menu)
    // var food = {}; // 創建一個空物件來存儲菜單數據

    // for (var i = 0; i < menu.length; i++) {
    //     var category = menu[i].name; // 獲取類別名稱
    //     var items = menu[i].items;   // 獲取食物項目數組
    //     food[category] = {}; // 在food物件中創建一個空物件來存儲當前類別的食物項目
    //     for (var j = 0; j < items.length; j++) {
    //         food[category][j + 1] = { name: items[j].name, count: 0 }; // 將食物項目添加到當前類別下，注意這裡的 j + 1 作為食物項目的編號
    //     }
    // }
    // //   console.log('menu:',food);
}

const dataanalysisController = {

    dataanalysisPage: (req, res) => {
        res.render('dataanalysis', {
        })
    },
    getDataAnalysis: async (req, res) => {
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

            // get order data from neo4j
            let forder = []
            forder = await getdatabytime(stime, etime);
            // console.log(forder)
            // res.send(forder)

            // calculate income by year and month
            const revenueByYearMonth = await getrevenueByYearMonth(forder)
            console.log('各月營收', revenueByYearMonth)
            // calculate unique urlid , urlid 來客組數
            console.log('本月來客組數 urlid:', await countUniqueUrlids(forder))



            res.send(JSON.stringify(forder))
        }
        catch (err) {
            console.log('getdata time error:', err)
            res.redirect('/dataanalysis')
        }
    },
    getObjectSales: async (req, res) => {
        // input
        // console.log(req.body)
        stime = `2023-05-17-23-59-00.000Z`
        etime = `2023-12-17-23-59-00.000Z`
        // timeInterval = day week month season year
        timeInterval = 'season'

        // get order data from neo4j
        let forder = []
        forder = await getdatabytime(stime, etime);
        let salesData = []
        salesData = await getSalesData(forder, timeInterval)
        console.log(JSON.stringify(salesData))
        res.send(salesData)

    }

}



module.exports = dataanalysisController