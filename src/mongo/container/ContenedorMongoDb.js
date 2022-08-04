const mongoose = require('mongoose');
const myLogs = require('../../utils/logsGenerator');

class ContenedorMongo {

    //CONSTRUCTOR
    constructor(model,url){
        this.model = model;
        this.url = url;
        this.lastID;
    }

    //CONNECT
    async connectToDB(){
        try {
            await mongoose.connect(this.url,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        } catch (error) {
            myLogs.showError (error);
            return {error: `ERROR al conectar a la base de datos: ${error}`};
        }
    }

    //CHECK ID
    async checkId(){
        try {
            let idToUse;
            let auxObject = await this.model.find({}).sort({ourId: -1}).limit(1);
            if (auxObject.length == 0){
                idToUse = 0;
            } else {
                idToUse = auxObject[0].ourId;
            }
            return idToUse;
        } catch (error) {
            myLogs.showError (error);
            return error;
        }
    }

    //CREATE
    async createMongo(object){
        let retorno = this.checkId().then(async (id) => {
            try {
                this.lastID = id + 1;
                object.ourId = this.lastID;
                let added = await this.model.insertMany(object);
                return added;
            } catch (error) {
                myLogs.showError (error);
                return error;
            }
        });
        return retorno;
    }

    //READ ONE (byId)
    async readMongo(prop){
        try {
            let document = await this.model.find(prop);
            return document;
        } catch (error) {
            myLogs.showError (error);
            return {error};
        }
    }

    //READ ALL
    async readAllMongo(){
        try {
            let document = await this.model.find({});
            return document;
        } catch (error) {
            myLogs.showError (error);
            return error;
        }
    }

    //UPDATE
    async updateMongo(idFind, change){
        if (typeof idFind == 'number'){
            try {
                let updated = await this.model.updateOne({ourId: idFind},{$set: change});
                return updated;
            } catch (error) {
                myLogs.showError (error);
                return error;
            }
        }
    }

    //DELETE ONE
    async deleteMongo(idFind){
        if (typeof idFind == 'number') {
            try {
                let deleted = await this.model.deleteOne().where({ourId:{$eq: idFind}});
                return deleted;
            } catch (error) {
                myLogs.showError (error);
                return error;
            }
        }
    }

    //DELETE ALL
    async deleteAllMongo(){
        try {
            await this.model.deleteMany({});
            return true;
        } catch (error) {
            myLogs.showError (error);
            return error;
        }
    }

}

module.exports = ContenedorMongo;