const mongoose = require('mongoose');

class CarritosMongo  {
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

  guardarCarrito = async carrito => {
    let retorno = this.model.find({}).then((carritos => {
      try {
        const carritosOrdenados = carritos.sort((a,b) => {
            return Number.parseInt(b.ourId) - Number.parseInt(a.ourId)
        })
        return carritosOrdenados[0].ourId + 1
      } catch (error) {
          return 1
      }
    })).then(async (lastID) => {
      try {
        carrito.ourId = lastID;
        let added = await this.model.insertMany(carrito);
        return added;
      } catch (error) {
        return error;
      }
    });
    return retorno;
  }

  obtenerCarritos = async obj => {
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

  actualizarCarrito = async (obj, change) => {
    try {
      let updated = await this.model.updateOne(obj, {$set: change});
      return updated;
    } catch (error) {
      return error;
    }
  }

  borrarCarritos = async (obj) => {
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

module.exports = CarritosMongo;