const MensajesDBMongo = require ('../model/repository/mensajesMongo')
const config = require ('../config/envPath')
const modelMongo = require('../model/mongo/mensajeSchema')
const Joi = require ('joi')

class ServiceMensajes {

  constructor(){
      this.mensajesDAO = new MensajesDBMongo(modelMongo, config.MONGODB_URI)
  }

  obtenerMensaje = async (author) => {
    try {
      if (typeof author == 'string') {
        let returned = await this.mensajesDAO.obtenerMensajes({author: author});
        if (returned.length == 0) {
          return {notFound: `No se encontró ningún mensaje de ${author}`}
        } else {
          return returned
        }
      } else {
        return {error: 'ERROR: se debe pasar un email'}
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerMensajes:',error}
    }
  }

  obtenerMensajes = async () => {
    try {
      return await this.mensajesDAO.obtenerMensajes()
    } catch (error) {
      return {error: 'ERROR en servicio obtenerMensajes:',error}
    }
  }

  /* obtenerAutores = async (email) => {
    try {
      let mensajes = await this.mensajesDAO.obtenerMensajes()
      let listAutores = []
      mensajes.forEach(mensaje => {
        if (mensaje.author == email) {
          listAutores = listAutores.push(mensaje.author)
        }
      });
      if (listAutores.length == 0) {
        return {notFound: `No se encontró ningún mensaje de ${author}`}
      } else {
        
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerMensajes:',error}
    }
  } */

  guardarMensajes = async (mensaje) => {
    try {
      let formato = ServiceMensajes.asegurarMensajeValido(mensaje, true)
      if (formato == true) {
        return await this.mensajesDAO.guardarMensaje(mensaje);
      } else {
        return {invalidFormat: formato.error}
      }
    } catch (error) {
      return {error: 'ERROR en servicio guardarMensajes:',error}
    }
  }

  actualizarMensaje = async (id, mensaje) => {
    try {
      let returned = await this.mensajesDAO.obtenerMensajes({_id: id});
      if (mensaje.author == returned[0].author) {
        let formato = ServiceMensajes.asegurarMensajeValido(mensaje, true)
        if (formato == true) {
          let updated = await this.mensajesDAO.actualizarMensaje({_id: id}, mensaje)
          if (updated.modifiedCount == 1) {
            return {hecho: `El mensaje con id = ${id} fue actualizado`}
          } else if (updated.modifiedCount == 0) {
            return {notFound: `No se encontró nungún mensaje con id = ${id}`}
          }
        } else {
          return {invalidFormat: formato.error}
        }
      } else {
        return {error: 'Prohibido actualizar el author del mensaje'}
      }
    } catch (error) {
      return {error: 'ERROR en servicio actualizarMensaje:',error}
    }
  }

  borrarMensajes = async (id) => {
    try {
      let deleted = await this.mensajesDAO.borrarMensajes({_id: id})
      if (deleted.deletedCount == 1) {
        return {hecho: `El mensaje con id ${id} fue eliminado`}
      } else if (deleted.deletedCount == 0){
        return {notFound: `El mensaje con id ${id} no existe`}
      }
    } catch (error) {
      return {error: 'ERROR en servicio borrarMensajes:', error}
    }
  }

  static asegurarMensajeValido(mensaje, requerido){
    try {
      const MensajeSchema = Joi.object({
        author: requerido ? Joi.string().required() : Joi.string(),
        text: requerido ? Joi.string().required() : Joi.string()
      })
      const {error} = MensajeSchema.validate(mensaje)
      if (error) throw error
      return true
    } catch (error) {
      return {error: `el mensaje posee un formato invalido o faltan datos: ${error.details[0].message}`}
    }
  }
}

module.exports = ServiceMensajes