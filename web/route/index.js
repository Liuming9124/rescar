const home         = require('./modules/home')
const menu         = require('./modules/menu')
const login        = require('./modules/login')
const cart         = require('./modules/cart')
const orderrecord  = require('./modules/orderrecord')
const merchant     = require('./modules/merchant')
const qrcode       = require('./modules/qrcode')
const robot        = require('./modules/robot')
const ring         = require('./modules/ring')


module.exports = app => {
  app.use('/home',        home)
  app.use('/menu',        menu)
  app.use('/cart',        cart)
  app.use('/login',       login)
  app.use('/orderrecord', orderrecord)
  app.use('/merchant',    merchant)
  app.use('/qrcode',      qrcode)
  app.use('/robot',       robot)
  app.use('/ring',        ring)
  app.use('/logout',(req, res) => {
    req.session.destroy();
    res.redirect('/login');
  })
  app.use('/', (req, res) => { return res.redirect('/menu') })
}
