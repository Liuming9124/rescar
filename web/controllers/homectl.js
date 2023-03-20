const db = require("../route/modules/db");
// var session = db.session()

const homeController = {

    homePage: async (req, res) => {
        // 使用async(非同步)function來確保執行完此function後才可以往下做
        async function checkSessionSeed(req) {
            var valid

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
                    valid = true;
                    req.session.seed = req.params.url;
                    session.close();
                    valid = 2
                } catch (error) {
                    console.error('Error checking session seed:', error);
                }
            } else {
                valid = 3
                res.status(404).send('Page not found');
            }

            return valid;
        }

        const valid = await checkSessionSeed(req);

        if (valid==3){  //  invalid url
            res.status(404).send('Page not found');
        }
        else if (valid==2){ //  vaild but redirect home url
            res.redirect('/home')
        }
        else if (valid==1){  // if valid
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
                .then(menu => {
                    // console.log('----------------------------')
                    // console.log(menu);
                    // console.log(menu.length)
                    // console.log(menu[0].name)
                    // console.log(menu.find(item => item.name === menu[0].name).items)
                    // console.log(menu.find(item => item.name === menu[0].name).items.length)
                    // console.log(menu.find(item => item.name === menu[0].name).items[0])
                    // console.log(menu.find(item => item.name === menu[0].name).items[0].price.low)
                    // console.log(menu.find(item => item.name === menu[0].name).items[0].data)
                    // console.log(menu.find(item => item.name === menu[0].name).items[0].name)
                    res.render('home', {
                        'menu': menu,
                        'session': req.session
                    });
                })
                .catch(error => {
                    console.log('home type error:')
                    console.log(error)
                })
                .finally(() => {
                    session.close();
                });
        }
    }
}

module.exports = homeController
