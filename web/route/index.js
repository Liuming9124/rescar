const home       = require('./modules/home')
const login      = require('./modules/login')

module.exports = app => {
  app.use('/home',  home)
  app.use('/login', login)
  app.use('/logout',(req, res) => {
    req.session.destroy();
    res.redirect('/login');
  })
  app.use('/', (req, res) => { return res.redirect('/home') })
}
