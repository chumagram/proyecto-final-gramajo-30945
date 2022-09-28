const ProductosDBMongo = require ('../model/repository/productosMongo')
const config = require ('../config/envPath')
const modelMongo = require('../model/mongo/productoSchema')
const Joi = require ('joi')

class ServiceProductos {

  constructor(){
    this.productosDAO = new ProductosDBMongo(modelMongo, config.MONGODB_URI)
  }

  obtenerProducto = async (obj) => {
    try {
      if (obj) {
        if (typeof obj == 'object') {
          let producto = await this.productosDAO.obtenerProductos(obj)
          if (producto.length == 0) {
            let prop = Object.keys(obj)
            return {notFound: `No se encontró el producto con ${prop}: ${obj[prop]}`}
          } else {
            return producto[0]
          }
        } else {
          return {error: `ERROR, el parámetro ${obj} no es un número`}
        }
      } else {
        return await this.productosDAO.obtenerProductos();
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerProductos:',error}
    }
  }

  guardarProducto = async (producto) => {
    try {
      let formato = ServiceProductos.asegurarProductoValido(producto, true);
      if (formato == true) {
        let validacion = await this.obtenerProducto({code: producto.code});
        if (validacion.notFound){
          let guardado = await this.productosDAO.guardarProducto(producto);
          return guardado[0]
        } else if (validacion.error) {
          return validacion.error
        } else {
          return {found: `ERROR, el producto con código ${producto.code} ya existe`}
        }
      } else {
        return {invalidFormat: formato.error}
      }
    } catch (error) {
      return {error: 'ERROR en servicio guardarProducto:',error}
    }
  }

  actualizarProducto = async (id, producto) => {
    try {
      let validacion = await this.obtenerProducto({ourId: id})
      if (validacion.notFound) {
        return {notFound: `No se encontró el producto con id = ${id}`}
      } else if (id == validacion[0].ourId) {
        let formato = ServiceProductos.asegurarProductoValido(producto, true)
        if (formato == true) {
          let updated = await this.productosDAO.actualizarProducto({ourId: id}, producto)
          if (updated.modifiedCount == 1) {
            return {hecho: `El producto con id = ${id} fue actualizado`}
          }
        } else {
          return {invalidFormat: formato.error}
        }
      } else {
        return {error: 'Prohibido actualizar el id del producto'}
      }
    } catch (error) {
      return {error: 'ERROR en servicio actualizarProducto:',error}
    }
  }
  
  borrarProductos = async (id) => {
    try {
      if (id) {
        let deleted = await this.productosDAO.borrarProductos({ourId: id})
        if (deleted.deletedCount == 1) {
          return {hecho: `El producto con id = ${id} fue eliminado`}
        } else if (deleted.deletedCount == 0){
          return {notFound: `El producto con id = ${id} no existe`}
        }
      } else {
        let deleted = await this.productosDAO.borrarProductos()
        return {hecho: `Se eliminaron todos los productos: ${deleted.deletedCount}`}
      }
    } catch (error) {
      return {error: 'ERROR en servicio borrarProductos:',error}
    }
  }

  static asegurarProductoValido(producto, requerido){
    try {
      const ProductoSchema = Joi.object({
        name: requerido ? Joi.string().required() : Joi.string(),
        price: requerido ? Joi.number().required() : Joi.number(),
        description: requerido ? Joi.string().required() : Joi.string(),
        thumbnail: requerido ? Joi.string().required() : Joi.string(),
        stock: requerido ? Joi.number().required() : Joi.number(),
        code: requerido ? Joi.number().required() : Joi.number()
      })
      const {error} = ProductoSchema.validate(producto)
      if (error) throw error
      return true
    } catch (error) {
      return {error: `ERROR, El producto posee un formato invalido o faltan datos: ${error.details[0].message}`}
    }
  }
}

module.exports = ServiceProductos