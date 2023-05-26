const db = require("../route/modules/db");
// var session = db.session()

const LRU = require('lru-cache');

// 創建一個 LRU Cache，最大存儲 100 筆資料
// const cache = new LRU(100);


const homeController = {

    homePage: async (req, res) => {
        // 使用async(非同步)function來確保執行完此function後才可以往下做
        async function checkSessionSeed(req) {
            var valid = 0
            // 先找出是否為合法URL，若合法才給予進入
            if (req.session.seed) {  //  get session seed
                valid = 1;
            } else if (req.params.url !== '') {    // get incoming url and set Seed in session
                try {
                    // find whether url exist in db
                    const session = db.session();
                    const result = await session.run(
                        `match(result:url{link:'${req.params.url}'}) return (result)`
                    );
                    const singleRecord = result.records[0];
                    const node = singleRecord.get(0);
                    console.log(node.properties.link);
                    // console.log('table',node.properties.table)
                    req.session.table = node.properties.table
                    valid = true;
                    req.session.seed = req.params.url;
                    session.close();
                    valid = 2   //  get session seed
                } catch (error) {
                    console.log('Error checking session seed');
                    res.redirect('/menu')
                }
            } else {
                console.log('Error checking session seed');
                res.redirect('/menu')
            }
            return valid;
        }

        const valids = await checkSessionSeed(req);

        if (valids==2){
            res.redirect('/home');
        }
        else if (valids==1){  // if valid
            // 需要印出的變數->menu
            var menu = []
            if (!req.session.cart) {
                req.session.cart = [];
            }
            session = db.session()
            session
                .run('match (n:type) return n.name')
                .then(result => {
                    // 依序抓取回傳的節點
                    result.records.forEach(record => {
                        menu.push({ tname: `${record.get('n.name')}` })
                    })
                })
                .then(async () => {
                    // 使用第二個db連接查詢下一層資料
                    const session2 = db.session()
                    for (var i = 0; i < menu.length; i++) {
                        var tname = menu[i].tname;
                        var itemsarr = []
                        // 查詢特定類別的商品並新增至itemsarr
                        try {
                            const results = await session2.run(`MATCH (t:type{name:'${tname}'})-[:own]->(i:item) RETURN i`);
                            results.records.forEach(record => {
                                itemsarr.push(record.get('i').properties);
                            });
                        } catch (error) {
                            console.error(error);
                        }
                        // add items to menu
                        // 為了避免直接修改原始的 menu 數組，先創建一個副本
                        const menuCopy = menu.slice();

                        // 使用 flatMap() 方法更新 menu 數組，將新數據添加到舊數據的末尾
                        menu = menuCopy.flatMap(item => {
                            if (item.tname === tname) {
                                return {
                                    name: item.tname,
                                    items: itemsarr
                                };
                            } else {
                                return item;
                            }
                        });
                    }
                    session2.close();
                    return menu;
                })
                .catch(error => {
                    console.log('home type error:', error)
                })
                .then(async () => {
                    // 使用第三個db查詢訂單有幾個
                    const session3 = db.session()
                    for (var i = 0; i < menu.length; i++) {
                        if (req.session.seed){
                            seed = req.session.seed
                        }else {
                            seed = req.session.url
                        }
                        try {
                            const results = await session3.run(`match(u:url{link:'${seed}'})-[:order]->(o:order) return (o)`);
                            req.session.orderamt = results.records.length
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    session3.close();
                    return menu;
                })
                .then(menu => {
                    session.close();
                    res.render(`home`, {
                        'menu': menu,
                        'session': req.session
                    });
                })
        }
    }
}

module.exports = homeController
