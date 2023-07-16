const db = require("../route/modules/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 1024 * 1024 * 10 }, // limit images size to 10MB
});

// define a function to generate new file name
const generateFileName = (file) => {
    const ext = path.extname(file.originalname); // get file extension
    const name = path.basename(file.originalname, ext); // get file name
    return `${name}_${Date.now()}${ext}`; // add timestamp to file name
}


const uploadController = {
    uploadPage: (req, res) => {
        var menu = []

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
                res.render('upload', {
                    'menu': menu
                });
            })
            .catch(error => {
                console.log('menu type error:')
                console.log(error)
            })
            .finally(() => {
                session.close();
            });
    },
    uploadItem: (req, res) => {
        // console.log(req.file); // print file info
        // console.log(req.body); // print form data
        var data = req.body
        console.log(data)

        // generate new file name
        const newFileName = generateFileName(req.file);

        // rename file
        fs.rename(req.file.path, `static/images/food/${newFileName}`, (err) => {
            if (err)
                console.error('rename err');
        });
        // res.send(200);

        var session = db.session()
        session
        .run(`
        merge(n:type{name:'${data.type}'})
        with n
        UNWIND [
        {name: '${data.name}', price: ${parseInt(data.price)}, description: '${data.description}', image: '${newFileName}'}
        ] AS p
        CREATE (i:item) SET i = p
        CREATE (n)-[:own]->(i)
        RETURN n, i`)
        .catch((err) => {
            console.log(err)
        })
        .then(() => {
            session.close()
            console.log('upload success')
            res.send(200);
        })
    },
    deleteItem: (req, res) => {
        const categoryName = req.body.categoryName;
        const itemName = req.body.itemName;
      
        const session = db.session();
        session
          .run(
            `
            MATCH (t:type {name: $categoryName})-[:own]->(i:item {name: $itemName})
            DETACH DELETE i
            `,
            { categoryName, itemName }
          )
          .then(() => {
            session.close();
            console.log('Item deleted successfully');
              // 在成功刪除後彈出警示框
              res.send("<script>alert('項目已成功刪除'); window.location.href = '/upload';</script>");
          })
          .catch((error) => {
            session.close();
            console.error('Error deleting item:', error);
            res.status(500).send('Error deleting item');
          });
      },
      
}

module.exports = uploadController