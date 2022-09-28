const {Router} = require('express')
const ordenesRoute = Router()

const ControladorOrdenes = require('../controller/ordenes.js')

class RouterOrdenes {

  constructor(){
    this.controladorOrdenes = new ControladorOrdenes()
  }

  start(){
    ordenesRoute.get('/:numOrden?', this.controladorOrdenes.obtenerOrden)
    ordenesRoute.post('/', this.controladorOrdenes.generarOrden)
    ordenesRoute.delete('/:numOrden', this.controladorOrdenes.borrarOrdenes)

    return ordenesRoute
  }
}

module.exports = RouterOrdenes