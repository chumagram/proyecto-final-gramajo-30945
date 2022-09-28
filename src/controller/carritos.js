const ServiceCarritos = require ('../service/carritos.js')
const logs = require('../utils/logsGenerator')

class ControladorCarrito {

  constructor(){
    this.serviceCarritos = new ServiceCarritos()
  }

  obtenerCarrito = async (req,res) => {
    try {
      let Carritos
      if (req.params.id == undefined){
        Carritos = await this.serviceCarritos.obtenerCarrito()
      } else {
        let id = parseInt(req.params.id)
        Carritos = await this.serviceCarritos.obtenerCarrito(id)
      }
      res.send(Carritos)
    } catch (error) {  
      logs.showError('error obtenerCarrito', error) 
    }
  }

  generarCarrito = async (req,res) => {
    try {
      let CarritoGenerado = await this.serviceCarritos.generarCarrito()
      res.json(CarritoGenerado)
    } catch (error) {
      logs.showError('error guardarCarrito', error)
    }
  }

  guardarEnCarrito = async (req,res) => {
    try {
      let idCart = parseInt(req.params.id_cart)
      let idProd = parseInt(req.params.id_prod)
      let CarritoActualizado = await this.serviceCarritos.guardarEnCarrito(idCart, idProd)
      res.json(CarritoActualizado)
    } catch (error) {
      logs.showError('error guardarEnCarrito', error)
    }
  }

  borrarDeCarrito = async (req,res) => {
    try {
      let idCart = parseInt(req.params.id_cart)
      let codeProd = parseInt(req.params.code_prod)
      let CarritoActualizado = await this.serviceCarritos.borrarDeCarrito(idCart, codeProd)
      res.json(CarritoActualizado)
    } catch (error) {   
      logs.showError('error borrarDeCarrito', error)
    }
  }

  borrarCarrito = async (req,res) => {
    try {
      let id = parseInt(req.params.id)
      let CarritoBorrado = await this.serviceCarritos.borrarCarrito(id)
      res.json(CarritoBorrado)
    } catch (error) {
      logs.showError('error borrarCarritos', error)
    }
  }
}

module.exports = ControladorCarrito