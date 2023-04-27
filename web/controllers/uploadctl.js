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

        res.render('upload', {
        })
    },
    uploadItem: (req, res) => {
        // console.log(req.file); // print file info
        // console.log(req.body); // print form data
        var data = req.body

        // generate new file name
        const newFileName = generateFileName(req.file);
        // rename file
        fs.rename(req.file.path, `static/images/food/${newFileName}`, (err) => {
            if (err)
                console.error(err);
        });
        var session = db.session()
        session
        .run(`
        merge(n:type{name:'${data.type}'})
        with n
        UNWIND [
        {name: '${data.name}', price: ${data.price}, description: '${data.description}', image: '${newFileName}'}
        ] AS p
        CREATE (i:item) SET i = p
        CREATE (n)-[:own]->(i)
        RETURN n, i`)
        .catch((err) => {
            console.log(err)
        })
        .then(() => {
            session.close()
            res.render('upload')
        })
    }
}

module.exports = uploadController
