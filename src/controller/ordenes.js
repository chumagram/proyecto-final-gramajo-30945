const ServiceOrdenes = require ('../service/ordenes')
const communication = require('../utils/communication')
const logs = require('../utils/logsGenerator')

class ControladorOrden {

  constructor(){
    this.serviceOrdenes = new ServiceOrdenes()
  }

  obtenerOrden = async (req,res) => {
    try {
      let Ordenes
      if (req.params.numOrden == undefined){
        Ordenes = await this.serviceOrdenes.obtenerOrden()
      } else {
        let numOrden = parseInt(req.params.numOrden)
        Ordenes = await this.serviceOrdenes.obtenerOrden(numOrden)
      }
      res.send(Ordenes)
    } catch (error) {
      logs.showError('error en obtenerOrden', error)   
    }
  }

  generarOrden = async (req,res) => {
    try {
      let usuario = req.body.user
      let OrdenGuardada = await this.serviceOrdenes.generarOrden(usuario)
      res.json(OrdenGuardada)
      communication.ordenCompletada(OrdenGuardada);
    } catch (error) {   
      logs.showError('error en generarOrden', error)
    }
  }

  borrarOrdenes = async (req,res) => {
    try {
      let numOrden = parseInt(req.params.numOrden)
      let OrdenBorrado = await this.serviceOrdenes.borrarOrden(numOrden)
      res.json(OrdenBorrado)
    } catch (error) {   
      logs.showError('error en borrarOrdenes', error)
    }
  }
}

module.exports = ControladorOrden