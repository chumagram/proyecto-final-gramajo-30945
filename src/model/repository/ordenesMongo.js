const mongoose = require('mongoose');

class OrdenesMongo  {
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

  guardarOrden = async orden => {
    let retorno = this.model.find({}).then((ordenes => {
      try {
        const ordenesOrdenadas = ordenes.sort((a,b) => {
          return Number.parseInt(b.numOrden) - Number.parseInt(a.numOrden)
        })
        return ordenesOrdenadas[0].numOrden + 1
      } catch (error) {
        return 1
      }
    })).then(async (lastID) => {
      try {
        orden.numOrden = lastID;
        let added = await this.model.insertMany(orden);
        return added;
      } catch (error) {
        return error;
      }
    });
    return retorno;
  }

  obtenerOrdenes = async obj => {
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

  actualizarOrden = async (obj, change) => {
    try {
      let updated = await this.model.updateOne(obj, {$set: change});
      return updated;
    } catch (error) {
      return error;
    }
  }

  borrarOrdenes = async (obj) => {
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

module.exports = OrdenesMongo;