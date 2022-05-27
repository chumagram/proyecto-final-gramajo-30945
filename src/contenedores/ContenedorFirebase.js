const { query } = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../data/store-wars-8dda5-firebase-adminsdk-ibhpt-3955ae495a.json");

class ContenedorFirebase {

    //CONSTRUCTOR
    constructor(serviceAccount,myCollection){
        this.serviceAccount = serviceAccount;
        this.collection = myCollection;
    }

    //CONNECT
    connectFirebase(){
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount)
        });
        const db = admin.firestore();
        const query = db.collection(this.collection);
        return query;
    }

    //CREATE
    async createFirebase(object){
        let query = this.connectFirebase();
        let arrayId, idToUse;

        try {
            const querySnapshot = await query.get();
            let docs = querySnapshot.docs;
            arrayId = docs.map((doc) => (parseInt(doc.id)));
            idToUse = Math.max(...arrayId) + 1;
            let doc = query.doc(`${idToUse}`);
            await doc.create(object);
            return idToUse;
        } catch (error) {
            return error;
        }
    }

    //READ ONE (byId)
    async readByIdFirebase(id){
        let query = this.connectFirebase();
        try {
            const doc = query.doc(`${id}`);
            const item = await doc.get();
            const response = item.data();
            return response;
        } catch (error) {
            return error;
        }
    }

    //READ ALL
    async readAllFirebase(){
        let query = this.connectFirebase();
        try {
            const querySnapshot = await query.get();
            let docs = querySnapshot.docs;
            const response = docs.map((doc) => ({id: doc.id}));
            return response;
        } catch (error) {
            return error;
        }
    }

    //UPDATE
    async updateFirebase(idFind, change){
        let query = this.connectFirebase();
        if (typeof idFind == 'number'){
            try {
                const doc = query.doc(`${idFind}`);
                let updated = await doc.update(change);
                return updated;
            } catch (error) {
                return error;
            }
        }
    }

    //DELETE ONE
    async deleteFirebase(idFind){
        let query = this.connectFirebase();
        if (typeof idFind == 'number') {
            try {
                const doc = query.doc(`${idFind}`);
                let deleted = await doc.delete();
                return deleted;
            } catch (error) {
                return error;
            }
        }
    }

    //DELETE ALL
    async deleteAllFirebase(){
        try {
            await this.connectFirebase().get().then(response => {
                response.forEach((element)=>{
                    element.ref.delete();
                })
            });
            return true;
        } catch (error) {
            return error;
        }
    }
}

let container = new ContenedorFirebase(serviceAccount,'container');

let prueba = {};
let cambio = {nombre: 'Checho2'};

//Conectarse a la base de datos
//container.connectToFirebase();

// Uso de Check ID
//container.checkId().then((res) => console.log(res));

// Uso del método createFirebase
//container.createFirebase(prueba).then((res) => console.log(res));

// Uso del método readByIdMongo
//container.readByIdFirebase(1).then((res) => console.log(res));

// Uso del método readAllFirebase
//container.readAllFirebase().then((res) => console.log(res));

// Uso del método updateFirebase
//container.updateFirebase(10, cambio).then((res) => console.log(res));

// Uso del método deleteFirebase
//container.deleteFirebase(2).then((res) => console.log(res));

// Uso del método deleteAllFirebase
//container.deleteAllFirebase().then((res) => console.log(res));

//module.exports = ContenedorMongo;