var express = require('express');
var session      = require('express-session');  //用來儲存登入狀態
var path    = require('path');
var db      = require('./route/modules/db.js');
var app     = express();
var cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');

// set icon
var favicon      = require('serve-favicon');
app.use(favicon(__dirname + '/static/images/favicon.ico'));


// set body-parser to parse json request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// set ejs engine
app.set('views', './views')
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({
  secret: 'book',
  resave: false,
  saveUninitialized: true,
  cookie : {
    maxAge : 1000 * 60 * 150, // 設定 session 的有效時間，單位毫秒  // 150分鐘
  }
}))



//建立 server


// db.conn();
var session = db.session(session)



app.use(express.static('static')); //讀取靜態檔案
app.use('*/js'        ,express.static(path.join(__dirname, '/static/js')));
app.use('*/css'       ,express.static(path.join(__dirname, '/static/css')));
app.use('*/images'    ,express.static(path.join(__dirname, '/static/images')));
app.use('*/ssl'       ,express.static(path.join(__dirname, '/static/ssl')));
app.use('*/qr'        ,express.static(path.join(__dirname, '/static/qr')))
app.use('*/crypto'    ,express.static(path.join(__dirname, '/static/crypto')));
// app.use('*/model'     ,express.static(path.join(__dirname, 'static/model')));
// app.use('*/js_static' ,express.static(path.join(__dirname, 'static/model/js_static')));


//require routes
require('./route')(app)
// error handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(500)
    console.log('500 error: ', err)
    return res.redirect('/home')
    // return res.render('error', { err })
  }
})

// if https:
// const https = require('https');
// const options = {
//   key: fs.readFileSync('./static/ssl/private.key'),
//   cert: fs.readFileSync('./static/ssl/certificate.crt')
// };

// https.createServer(options, app).listen(7000,function(){
//   console.log("listen on https://liuming.ddns.net")
//   console.log("listen on https://localhost:7000")
// });



// else: (http)

app.listen(7000,function(){ //7000這個port
  console.log("listen on http://localhost:7000")
})


