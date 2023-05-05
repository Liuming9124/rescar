const db = require("../route/modules/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads');
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);

    }
});

const upload = multer({ storage: storage });
// const upload = multer({
//     dest: 'uploads/',
//     limits: { fileSize: 1024 * 1024 * 200 }, // limit images size to 200MB
// });


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
        
        
        upload.fields(fields)(req, res, function (err) {
            if (err) {
                console.log('upload err:', err)
            } else {

                // console.log(req.file); // print file info
                console.log(req.body); // print form data
                // var data = req.body
                // console.log(fields)
                // console.log(data)

                // // generate new file name
                // const newFileName = generateFileName(req.file);
                // // rename file
                // fs.rename(req.file.path, `static/images/food/${newFileName}`, (err) => {
                //     if (err)
                //         console.error(err);
                // });
                // var session = db.session()
                // session
                // .run(`
                // merge(n:type{name:'${data.type}'})
                // with n
                // UNWIND [
                // {name: '${data.name}', price: ${data.price}, description: '${data.description}', image: '${newFileName}'}
                // ] AS p
                // CREATE (i:item) SET i = p
                // CREATE (n)-[:own]->(i)
                // RETURN n, i`)
                // .catch((err) => {
                //     console.log(err)
                // })
                // .then(() => {
                //     session.close()
                //     res.render('upload')
                // })
            }
        });

    }
}

module.exports = uploadController




// var multer = require('multer')
// var storage = multer.diskStorage({


//     destination: function (req, file, callback) {
//         callback(null, './public/audio');
//     },
//     filename: function (req, file, callback) {
//         console.log(file);
//         if (file.originalname.length > 6)
//             callback(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length - 6, file.originalname.length));
//         else
//             callback(null, file.fieldname + '-' + Date.now() + file.originalname);

//     }
// });

// const upload = multer({ storage: storage });


// router.post('/save/audio', upload.fields([{name: 'audio', maxCount: 1 }, { name: 'graphic', maxCount: 1 }]), (req, res) => {

//     const audioFile = req.files.audio[0];
//     const audioGraphic = req.files.graphic[0];
//     const fileName = req.body.title;


//     saveAudio(fileName, audioFile.filename, audioGraphic.filename, req.body.artist, function (error, success) {
//         req.flash('success', 'File Uploaded Successfully')

//         res.redirect('/')
//     });

// })