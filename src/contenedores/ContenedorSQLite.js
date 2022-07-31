const knex = require('knex');
const SqLiteOptions = require('../data/dbSql/config.js');

class Contenedor {
    constructor(options, tableName){
        this.conexion = knex(options);
        this.table = tableName; 
    }

    //CREATE
    async createSQL(object){
        try {
            const [id] = await this.conexion(this.table).insert(object);
            return id;
        } catch (error) { 
            return {error: error};
        }
    }

    //READ ONE 
    async readSQL(objFind) {
        let prop;
        for (let key in objFind) {prop = key};
        try {
            const readed = await this.conexion.from(this.table)
            .where(prop, '=', objFind[prop]);
            if (readed.length === 0) {
                return null;
            } else {
                return readed[0];
            }
        } catch (error) {
            return {error: error};
        }
    }

    //READ ALL
    async readAllSQL() {
        try {
            const rows = await this.conexion.from(this.table).select('*');
            return rows;
        } catch (error) {
            return {error: error};
        }
    }

    //UPDATE ONE
    async updateSQL(objFind, changes) {
        let prop;
        for (let key in objFind) {prop = key};
        try {
            const updated = await this.conexion.from(this.table)
            .where(prop, '=', objFind[prop]).update(changes);
            return updated;
        } catch (error) {
            return {error: error};
        }
    }

    //DELETE ONE
    async deleteSQL(id) {
        try {
          const deleted = await this.conexion.from(this.table)
          .where('id', '=', id).del();
          return deleted
        } catch (error) {
          return {error: error};
        }
    }
    
    //DELETE ALL
    async deleteAllSQL() {
        try {
            const deleted = await this.conexion.from(this.table).select('*').del();
            return deleted;
        } catch (error) {
            return {error: error};
        }
    }
    
    //DESCONNECT TO SQL
    async desconnectSQL() {
        await this.conexion.destroy();
    }
}

// Creacion de la clase container
//let container = new Contenedor(SqLiteOptions, 'container');

let prueba = {
    name: "Biblia",
    price: 1200
}

//Uso del método "createSQL"
//container.createSQL(prueba).then((res) => console.log(res));

// Uso del método "readSQL"
//container.readSQL({id:1}).then((res) => console.log(res));

// Uso del método "readAll"
//container.readAllSQL().then((res) => console.log(res));

// Uso del método "deleteSQL"
//container.deleteSQL(4).then((res) => console.log(res));

// Uso del método "updateSQL"
//container.updateSQL({id: 1},{price: 1000}).then((res) => console.log(res));

// Uso del método "deleteAllSQL"
//container.deleteAllSQL().then((res) => console.log(res));

module.exports = Contenedor;