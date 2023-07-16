const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 1024 * 1024 * 10 }, // 限制上传文件大小为10MB
});



const uploadCtl = require('../../controllers/uploadctl')

router.get('/', uploadCtl.uploadPage)
router.post('/uploadItem', upload.single('image'), uploadCtl.uploadItem)
router.post('/deleteItem', uploadCtl.deleteItem);


module.exports = router