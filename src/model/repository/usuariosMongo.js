const mongoose = require('mongoose');

class UsuariosMongo {
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

  guardarUsuario = async usuario => {
    try {
      let added = await this.model.insertMany(usuario);
      return added[0];
    } catch (error) {
      return error
    }
  }

  obtenerUsuarios = async obj => {
    try {
      if (obj){
        let document = await this.model.find(obj);
        return document;
      } else {
        let document = await this.model.find({});
        return document;
      }
    } catch (error) {
      return {error: `obtenerUsuarios error: ${error}`};
    }
  }

  actualizarUsuario = async (obj, change) => {
    try {
      let updated = await this.model.updateOne(obj, {$set: change});
      return updated;
    } catch (error) {
      return error;
    }
  }

  borrarUsuarios = async (obj) => {
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

module.exports = UsuariosMongo;