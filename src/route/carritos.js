const {Router} = require('express')
const carritosRoute = Router()

const ControladorCarritos = require('../controller/carritos.js')

class RouterNoticias {

  constructor(){
    this.controladorCarritos = new ControladorCarritos()
  }

  start(){
    carritosRoute.get('/:id?', this.controladorCarritos.obtenerCarrito)
    carritosRoute.post('/', this.controladorCarritos.generarCarrito)
    carritosRoute.put('/add/:id_cart/:id_prod', this.controladorCarritos.guardarEnCarrito)
    carritosRoute.put('/del/:id_cart/:code_prod', this.controladorCarritos.borrarDeCarrito)
    carritosRoute.delete('/:id?', this.controladorCarritos.borrarCarrito)
    
    return carritosRoute
  }
}

module.exports = RouterNoticias