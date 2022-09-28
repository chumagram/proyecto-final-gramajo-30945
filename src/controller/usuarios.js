const serviceUsuarios = require('../service/usuarios')
const communication = require('../utils/communication')
const logs = require('../utils/logsGenerator')

class ControladorUsuarios {
  constructor(){
    this.serviceUsuarios = new serviceUsuarios ()
  }
    
  login = (req, res) => {
    try {
      if (req.isAuthenticated()) {
        res.cookie('email', req.user.email).cookie('alias', req.user.alias).redirect('/productos');
      }
    } catch (error) {
      logs.showError('error en login', error)
    }
  }
      
  failLogin = (req, res) => {
    try {
      res.cookie('initErr', true, { maxAge: 1000 }).redirect('/')
    } catch (error) {
      logs.showError('error en failLogin', error)
    }
  }
      
  signup = (req, res) => {
    try {
      if (req.isAuthenticated()) {
        communication.welcomeMail(req.user);
        communication.newUserMail(req.user);
        res.redirect('/');
      } else {
        logs.showError('falló la authentication')
      }
    } catch (error) {
      logs.showError('error en signup', error)
    }
  }
      
  failSignup = (req, res) => {
    try {
      res.cookie('registerErr', true, { maxAge: 1000 }).redirect('/')
    } catch (error) {
      logs.showError('error en failSignup', error)
    }
  }
}

module.exports = ControladorUsuarios