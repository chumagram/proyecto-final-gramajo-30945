const {Router} = require('express')
const mensajesRoute = Router()

const ControladorMensajes = require('../controller/mensajes.js')

class RouterMensajes {

  constructor(){
    this.controladorMensajes = new ControladorMensajes()
  }

  start(){
    mensajesRoute.get('/', this.controladorMensajes.mostrarChat)
    mensajesRoute.get('/:email?', this.controladorMensajes.obtenerMjsAuthor)
    return mensajesRoute
  }

  socketChat = (socket, io) => {
    this.controladorMensajes.initChat(socket);
    socket.on('new-message', data => {
      this.controladorMensajes.newMessage(io, data)
    })
  }
}

module.exports = RouterMensajes