const OrdenesDBMongo = require ('../model/repository/ordenesMongo')
const config = require ('../config/envPath')
const modelMongo = require('../model/mongo/ordenesSchema')
const modelCart = require('../model/mongo/carritoSchema')
const Joi = require ('joi')

class ServiceOrdenes {

  constructor(){
    this.ordenesDAO = new OrdenesDBMongo(modelMongo, config.MONGODB_URI)
  }

  obtenerOrden = async (numOrden) => {
    try {
      if (!numOrden) return await this.ordenesDAO.obtenerOrdenes()
      if (typeof numOrden != 'number') return {error: `ERROR, el parámetro ingresado (${numOrden}) no es un número`}
      let orden = await this.ordenesDAO.obtenerOrdenes({numOrden: numOrden})
      if (orden.length == 0) {
        return {notFound: `No se encontró la orden con numero: ${numOrden}`}
      } else {
        return orden[0]
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerOrdenes:',error}
    }
  }

  generarOrden = async (usuario) => {
    try {
      const validarUsuario = ServiceOrdenes.asegurarUsuarioValido(usuario, true)
      if (validarUsuario.error) {
        return validarUsuario
      } else {
        const listaProd = await ServiceOrdenes.traerListaProd(usuario.cartId)
        if (listaProd.notFound) return listaProd
        let orden = {
          email: usuario.email,
          name: usuario.name,
          lastname: usuario.lastname,
          dirEnvio: usuario.address,
          listP: listaProd
        }
        let ordenGenerado = await this.ordenesDAO.guardarOrden(orden);
        return ordenGenerado[0]
      }
    } catch (error) {
      return {error: 'ERROR en servicio guardarOrden:',error}
    }
  }

  borrarOrden = async (numOrden) => {
    try {
      if (typeof numOrden != 'number') return {error: `ERROR, el parámetro ingresado (${numOrden}) no es un número`} 
      let deleted = await this.ordenesDAO.borrarOrdenes({numOrden: numOrden})
      if (deleted.deletedCount == 1) return {hecho: `La orden numero ${numOrden} fue eliminada`}
      if (deleted.deletedCount == 0) return {notFound: `La orden numero ${numOrden} no existe`}
    } catch (error) {
      return {error: 'ERROR en servicio borrarOrdenes:',error}
    }
  }

  static async traerListaProd (idCart){
    if (idCart == 0) return {notFound: `El usuario aún no tiene carrito`}
    let carrito = await modelCart.find({ourId: idCart})
    if (carrito[0].length == 0) return {notFound: `No se encontró el carrito con ID: ${idCart}`}
    if (carrito[0].listP.length == 0) return {cartEmpty: `El carrito con id=${idCart} está vacío`}
    return carrito[0].listP
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

module.exports = ServiceOrdenes