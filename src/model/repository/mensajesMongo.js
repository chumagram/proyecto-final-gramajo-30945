const mongoose = require('mongoose');

class MensajesMongo {
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

  guardarMensaje = async mensaje => {
    try {
      let added = await this.model.insertMany(mensaje);
      return added;
    } catch (error) {
      return error
    }
  }

  obtenerMensajes = async obj => {
    try {
      if (obj){
        let mensajes = await this.model.find(obj);
        return mensajes;
      } else {
        let allMensajes = await this.model.find({});
        return allMensajes;
      }
    } catch (error) {
      return {error: `obtenerMensajes error: ${error}`};
    }
  }

  actualizarMensaje = async (obj, change) => {
    try {
      let updated = await this.model.updateOne(obj, {$set: change});
      return updated;
    } catch (error) {
      return error;
    }
  }

  borrarMensajes = async (obj) => {
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

module.exports = MensajesMongo;