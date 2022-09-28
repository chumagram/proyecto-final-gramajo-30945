const mongoose = require('mongoose');

class ProductosMongo  {
  constructor(model,url){
    (async () => {
      this.url = url;
      await mongoose.connect(this.url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    })();
    this.model = model;
  }

  guardarProducto = async producto => {
    let retorno = this.model.find({}).then((productos => {
      try {
        const productosOrdenados = productos.sort((a,b) => {
            return Number.parseInt(b.ourId) - Number.parseInt(a.ourId)
        })
        return productosOrdenados[0].ourId + 1
      } catch (error) {
          return 1
      }
    })).then(async (lastID) => {
      try {
        producto.ourId = lastID;
        let added = await this.model.insertMany(producto);
        return added;
      } catch (error) {
        return error;
      }
    });
    return retorno;
  }

  obtenerProductos = async obj => {
    try {
      if (obj){
        let document = await this.model.find(obj);
        return document;
      } else {
        let document = await this.model.find({});
        return document;
      }
    } catch (error) {
      return error;
    }
  }

  actualizarProducto = async (obj, change) => {
    try {
      let updated = await this.model.updateOne(obj, {$set: change});
      return updated;
    } catch (error) {
      return error;
    }
  }

  borrarProductos = async (obj) => {
    try {
      if (obj) {
        let prop = Object.keys(obj)
        let objAux = {}
        objAux[prop] = {$eq: obj[prop]}
        let deleted = await this.model.deleteOne().where(objAux);
        return deleted;
      } else {
        let deleted = await this.model.deleteMany({});
        return deleted;
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProductosMongo;