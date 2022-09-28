const ServiceMensajes = require ('../service/mensajes.js')
const logs = require('../utils/logsGenerator')

class ControladorMensajes {

  constructor(){
    this.serviceMensajes = new ServiceMensajes()
  }

  mostrarChat = (req, res) => {
    try {
      res.render('pages/chat',{});
    } catch (error) {
      logs.showError('error en mostrarChat', error)
    }
  }

  initChat = async (socket) => {
    try {
      const mensajes = await this.serviceMensajes.obtenerMensajes()
      socket.emit('mensajeria', mensajes);
    } catch (error) {
      logs.showError('error en initChat', error)
    }
  }

  newMessage = async (io, data) => {
    try {
      let email = data.email;
      let text = data.text;
      await this.serviceMensajes.guardarMensajes({author: email, text: text});
      const mensajes = await this.serviceMensajes.obtenerMensajes();
      io.sockets.emit('mensajeria', mensajes);
    } catch (error) {
      logs.showError('error en newMessage', error)
    }
  }

  obtenerMjsAuthor = async (req, res) => {
    try {
      let email = req.params.email
      let mensajes = await this.serviceMensajes.obtenerMensaje(email)
      res.render('pages/chatEmail', {msjsAuthor: JSON.stringify(mensajes)})
    } catch (error) {
      logs.showError('error en obtenerMjsAuthor', error)
    }
  }
}

module.exports = ControladorMensajes