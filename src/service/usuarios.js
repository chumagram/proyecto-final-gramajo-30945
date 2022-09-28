const UsuariosDBMongo = require ('../model/repository/usuariosMongo')
const config = require ('../config/envPath')
const modelMongo = require('../model/mongo/usuariosSchema')
const Joi = require ('joi')

class ServiceUsuarios {

  constructor(){
    this.usuariosDAO = new UsuariosDBMongo(modelMongo, config.MONGODB_URI)
  }

  obtenerUsuario = async (email) => {
    try {
      if (typeof email == 'string') {
        let returned = await this.usuariosDAO.obtenerUsuarios({email: email});
        if (returned.length == 0) {
          return {notFound: `No se encontró el usuario ${email}`}
        } else {
          return returned[0]
        }
      } else {
        return {error: 'ERROR: se debe pasar un email'}
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerUsuarios:',error}
    }
  }

  obtenerUsuarios = async () => {
    try {
      return await this.usuariosDAO.obtenerUsuarios()
    } catch (error) {
      return {error: 'ERROR en servicio obtenerUsuarios:',error}
    }
  }

  guardarUsuarios = async (usuario) => {
    try {
      let formato = ServiceUsuarios.asegurarUsuarioValido(usuario, true)
      if (formato == true) {
        let validacion = await this.obtenerUsuario(usuario.email);
        if (validacion.notFound){
          let returned = await this.usuariosDAO.guardarUsuario(usuario);
          return returned
        } else if (validacion.error) {
          return validacion.error
        } else {
          return {found: `ERROR, el usuario ${usuario.email} ya existe`}
        }
      } else {
        return {invalidFormat: formato.error}
      }
    } catch (error) {
      return {error: 'ERROR en servicio guardarUsuarios:',error}
    }
  }

  actualizarUsuario = async (email, usuario) => {
    try {
      if (email == usuario.email) {
        let formato = ServiceUsuarios.asegurarUsuarioValido(usuario, true)
        if (formato == true) {
          let updated = await this.usuariosDAO.actualizarUsuario({email: email}, usuario)
          if (updated.modifiedCount == 1) {
            return {hecho: `El usuario con email ${email} fue actualizado`}
          } else if (updated.modifiedCount == 0) {
            return {notFound: `No se encontró el usuario ${email}`}
          }
        } else {
          return {invalidFormat: formato.error}
        }
      } else {
        return {error: 'Prohibido actualizar el email'}
      }
    } catch (error) {
      return {error: 'ERROR en servicio actualizarUsuario:',error}
    }
  }

  borrarUsuarios = async(email) => {
    try {
      let deleted = await this.usuariosDAO.borrarUsuarios({email: email})
      if (deleted.deletedCount == 1) {
        return {hecho: `El usuario con email ${email} fue eliminado`}
      } else if (deleted.deletedCount == 0){
        return {notFound: `El usuario con email ${email} no existe`}
      }
    } catch (error) {
      return {error: 'ERROR en servicio borrarUsuarios:',error}
    }
  }

  static asegurarUsuarioValido(usuario, requerido){
    try {
      const UsuarioSchema = Joi.object({
        email: requerido ? Joi.string().required() : Joi.string(),
        password: requerido ? Joi.string().required() : Joi.string(),
        name: requerido ? Joi.string().required() : Joi.string(),
        lastname: requerido ? Joi.string().required() : Joi.string(),
        age: requerido ? Joi.number().required() : Joi.number(),
        address: requerido ? Joi.string().required() : Joi.string(),
        alias: requerido ? Joi.string().required() : Joi.string(),
        cartId: Joi.number()
      })
      const {error} = UsuarioSchema.validate(usuario)
      if (error) throw error
      return true
    } catch (error) {
      return {error: `el usuario posee un formato invalido o faltan datos: ${error.details[0].message}`}
    }
  }
}

module.exports = ServiceUsuarios