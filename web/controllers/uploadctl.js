const db = require("../route/modules/db");
const funCtl = require("../route/modules/fun");
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
    uploadPage: async (req, res) => {
        var menu = []
        menu = JSON.parse(await funCtl.getMenu())
        res.render('upload', {
            'menu': menu
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