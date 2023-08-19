const db = require("../route/modules/db");
// 引用常見function
const funCtl = require("../route/modules/fun");

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
                        `match(result:url{link:'${req.params.url}',status:0}) return (result)`
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
            // 從Fun.js中取得menu
            menu = JSON.parse(await funCtl.getMenu())
            var seed
            if (req.session.seed){
                seed = req.session.seed
            }else {
                seed = req.session.url
            }
            // 查詢訂單有幾個
            session = db.session()
            session
                .run(`match(u:url{link:'${seed}'})-[:order]->(o:order) return (o)`)
                .then(results => {
                    req.session.orderamt = results.records.length
                    session.close();
                })
            // console.log('menu:', menu)
            res.render(`home`, {
                'menu': menu,
                'session': req.session
            });
        }
    }
}

module.exports = homeController
