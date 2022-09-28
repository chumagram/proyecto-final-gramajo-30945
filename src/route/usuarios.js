const {Router} = require('express')
const usuariosRoute = Router()

const ControladorUsuarios = require('../controller/usuarios.js')
const passport = require('passport')

class RouterProductos {
  constructor(){
    this.controladorUsuarios = new ControladorUsuarios()
  }

  start(){
    usuariosRoute.post('/login', passport.authenticate('login', { failureRedirect: '/usuarios/fail_login' }), this.controladorUsuarios.login)
    usuariosRoute.get('/fail_login', this.controladorUsuarios.failLogin)
    usuariosRoute.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), this.controladorUsuarios.signup);
    usuariosRoute.get('/fail_signup', this.controladorUsuarios.failSignup)

    return usuariosRoute
  }
}

module.exports = RouterProductos