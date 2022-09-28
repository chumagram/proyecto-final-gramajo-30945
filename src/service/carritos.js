const CarritosDBMongo = require ('../model/repository/carritosMongo')
const config = require ('../config/envPath')
const modelMongo = require('../model/mongo/carritoSchema')
const modelProd = require('../model/mongo/productoSchema')
const Joi = require ('joi')

class ServiceCarritos {

  constructor(){
    this.carritosDAO = new CarritosDBMongo(modelMongo, config.MONGODB_URI)
  }

  obtenerCarrito = async (id) => {
    try {
      if (id) {
        if (typeof id == 'number') {
          let carrito = await this.carritosDAO.obtenerCarritos({ourId: id})
          if (carrito.length == 0) {
            return {notFound: `No se encontró el carrito con id: ${id}`}
          } else {
            return carrito[0]
          }
        } else {
          return {error: `ERROR, el parámetro ingresado (${id}) no es un número`}
        }
      } else {
        return await this.carritosDAO.obtenerCarritos()
      }
    } catch (error) {
      return {error: 'ERROR en servicio obtenerCarritos:',error}
    }
  }

  generarCarrito = async () => {
    try {
      let carritoGenerado = await this.carritosDAO.guardarCarrito({listP:[]});
      return carritoGenerado[0]
    } catch (error) {
      return {error: 'ERROR en servicio guardarCarrito:',error}
    }
  }

  guardarEnCarrito = async (idCart, idProd) => {
    try {
      let producto = await ServiceCarritos.traerProducto(idProd)
      let carrito = await this.obtenerCarrito(idCart)
      if (carrito.notFound) {
        return {notFound: `No se encontró el carrito con id = ${idCart}`}
      } else if (producto.notFound) {
        return producto
      } else {
        let porductoBuscado = carrito.listP.find(found => found.code === producto.code)
        if (porductoBuscado == undefined) {
          producto.quantity = 1;
          carrito.listP.push(producto)
          let updated = await this.carritosDAO.actualizarCarrito({ourId: idCart}, carrito)
          if (updated.modifiedCount == 1) {
            return {hecho: `producto con código ${producto.code} añadido al carrito con id ${idCart}`}
          }
        } else {
          let newQuantity = porductoBuscado.quantity + 1
          let indice = carrito.listP.findIndex(found => found.code === producto.code)
          carrito.listP[indice].quantity = newQuantity
          let updated = await this.carritosDAO.actualizarCarrito({ourId: idCart}, carrito)
          if (updated.modifiedCount == 1) {
            return {hecho: `el producto con código ${producto.code} sufrió un incremento en su quantity = ${newQuantity}`}
          }
        }
      }
    } catch (error) {
      return {error: 'ERROR en servicio guardarEnCarrito:',error}
    }
  }
  
  borrarDeCarrito = async (idCart, codeProduct) => {
    try {
      let carrito = await this.obtenerCarrito(idCart)
      let indice = carrito.listP.findIndex(found => found.code === codeProduct)
      if (carrito.notFound) return carrito
      if (indice == -1) {
        return {notFound: `El producto con código ${codeProduct}, no existe en el carrito con id = ${idCart}`}
      }
      carrito.listP.splice(indice, 1)
      let updated = await this.carritosDAO.actualizarCarrito({ourId: idCart}, carrito)
      if (updated.modifiedCount == 1) {
        return {hecho: `el producto con código ${codeProduct} fue eliminado del carrito con id = ${idCart}`}
      }
    } catch (error) {
      return {error: 'ERROR en servicio borrarDeCarrito:',error}
    }
  }

  borrarCarrito = async (id) => {
    try {
      if (typeof id == 'number') {
        let deleted = await this.carritosDAO.borrarCarritos({ourId: id})
        if (deleted.deletedCount == 1) {
          return {hecho: `El carrito con id = ${id} fue eliminado`}
        } else if (deleted.deletedCount == 0){
          return {notFound: `El carrito con id = ${id} no existe`}
        }
      } else {
        return {error: `ERROR, el parámetro ingresado (${id}) no es un número`}
      }
    } catch (error) {
      return {error: 'ERROR en servicio borrarCarritos:',error}
    }
  }

  static async traerProducto (idProd){
    let producto = await modelProd.find({ourId: idProd})
    if (producto.length == 0) {
      let prop = Object.keys(obj)
      return {notFound: `No se encontró el producto con ${prop}: ${obj[prop]}`}
    } else {
      return {
        name: producto[0].name,
        price: producto[0].price,
        description: producto[0].description,
        thumbnail: producto[0].thumbnail,
        code: producto[0].code
      }
    }
  }
}

module.exports = ServiceCarritos