var express = require('express');
var session      = require('express-session');  //用來儲存登入狀態
var path    = require('path');
var db      = require('./route/modules/db.js');
var app     = express();
const expressWs = require('express-ws')(app);
var cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');

// set icon
var favicon      = require('serve-favicon');
app.use(favicon(__dirname + '/static/images/favicon.ico'));


// set body-parser to parse json request //TODO: remove this
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// set ejs engine
app.set('views', './views')
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret')); // TODO: remove this
app.use(session({
  secret: 'book',
  resave: false,
  saveUninitialized: true,
  cookie : {
    maxAge : 1000 * 60 * 150, // 設定 session 的有效時間，單位毫秒  // 150分鐘
  }
}))


// WebSocket server
app.ws('/', function (ws, req) {
  // Event handler for incoming WebSocket messages
  ws.on('message', function incoming(message) {
    // Broadcast the received message to all connected clients
    expressWs.getWss().clients.forEach(function each(client) {
      client.send('{1:1,2:8}');
    });
    console.log('Received message:', message);
  });
  console.log('Socket connected. Testing:', req.testing);
});


//建立 server


// db.conn();
var session = db.session(session) // TODO: remove this



app.use(express.static('static')); //讀取靜態檔案
app.use('*/js'        ,express.static(path.join(__dirname, '/static/js')));
app.use('*/css'       ,express.static(path.join(__dirname, '/static/css')));
app.use('*/images'    ,express.static(path.join(__dirname, '/static/images')));
// app.use('*/ssl'       ,express.static(path.join(__dirname, '/static/ssl')));
app.use('*/qr'        ,express.static(path.join(__dirname, '/static/qr')))
app.use('*/fonts'        ,express.static(path.join(__dirname, '/static/fonts')))
// app.use('*/crypto'    ,express.static(path.join(__dirname, '/static/crypto')));
// app.use('*/pki-validation',express.static(path.join(__dirname, '/static/ssl')));


//require routes
require('./route')(app)
// error handling


//set http or https

// read config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (config.url=="0"){
  app.listen(config.port,function(){ //7000這個port
    console.log(`listen on ${config.http}`)
  })
}
else if (config.url=="1"){
  
  // if https:
  const https = require('https');
  const options = {
    key: fs.readFileSync('./static/ssl/private.key'),
    cert: fs.readFileSync('./static/ssl/certificate.crt')
  };

  https.createServer(options, app).listen(config.port,function(){
    console.log(`listen on ${config.https}`)
    // console.log(`listen on ${config.http}`)
  });
}

