var express = require('express');
var session      = require('express-session');  //用來儲存登入狀態
var path    = require('path');
var db      = require('./route/modules/db.js');
var app     = express();
var cookieParser = require('cookie-parser');



var favicon      = require('serve-favicon');
app.use(favicon(__dirname + '/static/images/favicon.ico'));

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
    maxAge : 1000 * 60 * 10, // 設定 session 的有效時間，單位毫秒
  }
}))



//建立 server


// db.conn();
var session = db.session(session)



app.use(express.static('static')); //讀取靜態檔案
app.use('*/js'        ,express.static(path.join(__dirname, 'static/js')));
app.use('*/css'       ,express.static(path.join(__dirname, 'static/css')));
app.use('*/images'    ,express.static(path.join(__dirname, 'static/images')));
// app.use('*/webfonts'  ,express.static(path.join(__dirname, 'static/webfonts')));
// app.use('*/model'     ,express.static(path.join(__dirname, 'static/model')));
// app.use('*/js_static' ,express.static(path.join(__dirname, 'static/model/js_static')));





//require routes
require('./route')(app)
// error handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(500)
    console.log('500 error: ', err)
    return res.render('error', { err })
  }
})


app.listen(7000,function(){ //7000這個port
  console.log("listen on http://localhost:7000")
})


