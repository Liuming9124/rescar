const express = require('express')
const router = express.Router()

const multer = require('multer');

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

const uploadCtl = require('../../controllers/uploadctl')



router.get('/', uploadCtl.uploadPage)
router.post('/uploadItem', upload.fields([{name: 'image', maxCount: 10 }]), uploadCtl.uploadItem)



module.exports = router