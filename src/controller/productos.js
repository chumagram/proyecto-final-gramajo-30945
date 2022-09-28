const ServiceProductos = require ('../service/productos.js')
const logs = require('../utils/logsGenerator')

class ControladorProducto {

  constructor(){
    this.serviceProductos = new ServiceProductos()
  }

  obtenerProducto = async (req,res) => {
    try {
      let Productos
      if (req.params.id == undefined){
        Productos = await this.serviceProductos.obtenerProducto()
      } else {
        let id = parseInt(req.params.id)
        Productos = await this.serviceProductos.obtenerProducto({ourId: id})
      }
      res.send(Productos)
    } catch (error) {   
      logs.showError('error en obtenerProducto', error)
    }
  }

  guardarProducto = async (req,res) => {
    try {
      let Producto = req.body
      let ProductoGuardado = await this.serviceProductos.guardarProducto(Producto)

      res.json(ProductoGuardado)
    } catch (error) {   
      logs.showError('error en guardarProducto', error)
    }
  }

  actualizarProducto = async (req,res) => {
    try {
      let Producto = req.body
      let id = req.params.id
      let ProductoActualizado = await this.serviceProductos.actualizarProducto(id,Producto)
      res.json(ProductoActualizado)
    } catch (error) {   
      logs.showError('error en actualizarProducto', error)
    }
  }

  borrarProductos = async (req,res) => {
    try {
      let id = req.params.id
      let ProductoBorrado = await this.serviceProductos.borrarProductos(id)
      res.json(ProductoBorrado)
    } catch (error) {   
      logs.showError('error en borrarProductos', error)
    }
  }
}

module.exports = ControladorProducto