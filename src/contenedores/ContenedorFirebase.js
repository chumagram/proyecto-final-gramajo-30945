const admin = require("firebase-admin");
//const serviceAccount = require("../data/store-wars-8dda5-firebase-adminsdk-ibhpt-3955ae495a.json");

class ContenedorFirebase {

    //CONSTRUCTOR
    constructor(serviceAccount,myCollection){
        this.serviceAccount = serviceAccount;
        this.collection = myCollection;
        this.query = this.connectFirebase();
    }

    //CONNECT
    connectFirebase(){
        /* admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount)
        }); */
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(this.serviceAccount)
            });
        }
        const db = admin.firestore();
        const query = db.collection(this.collection);
        return query;
    }

    //CREATE
    async createFirebase(object){
        let response;
        try {
            // GETTING THE DOCUMENT
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            response = docs.map((doc) => ({id: doc.id}));

            if (response.length == 0){ // SI LA LISTA ESTABA VACÍA
                let id = 1;
                let doc = this.query.doc(`${id}`);
                await doc.create(object);
                return id;
            } else { // SI LA LISTA NO ESTA VACIA

                // Calculando el id a asignar
                let max = Math.max(...response.map(document => parseInt(document.id)));
                let newId = max + 1;
                
                // Creando el documento
                let doc = this.query.doc(`${newId}`);
                await doc.create(object);
                return newId;
            }
        } 
        catch (error){
            return { error: `Fallo por createFirebase:${error}`};
        }
    }

    //READ ONE (byId)
    async readDocumentFirebase(objFind){
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs, readed = [], propFind, docFound;
            let flagFind = true, flagKey = true; // Banderas
            for (let key in objFind) {propFind = key};

            docs.forEach(doc => {
                let docId = {id: parseInt(doc.id)}
                let props = doc.data();
                readed = Object.assign(docId,props);
                for (let key in readed) {
                    if (propFind == key) {
                        flagKey = false;
                        if (objFind[key] == readed[key]){
                            flagFind = false;
                            docFound = readed;
                        }
                    }
                }
            });

            if (flagKey){
                return {error: `La propiedad ${propFind} no existe en ningún documento`};
            } else if (flagFind){
                return {error: `No se encontró documento con ${propFind}: ${objFind[propFind]}`};
            } else {
                return docFound;
            }
        } catch (error) {
            return error;
        }
    }

    //READ ALL
    async readAllFirebase(){
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs, arrayReaded = [];
            docs.forEach(doc => {
                let docId = {id: parseInt(doc.id)}
                let props = doc.data();
                arrayReaded.push(Object.assign(docId,props));
            });
            return arrayReaded;
        } catch (error) {
            return error;
        }
    }

    //UPDATE
    async updateFirebase(idFind, change){
        if (typeof idFind == 'number'){
            try {
                const doc = this.query.doc(`${idFind}`);
                let updated = await doc.update(change);
                return updated;
            } catch (error) {
                return {error: error};
            }
        }
    }

    //DELETE ONE
    async deleteFirebase(idFind){
        if (typeof idFind == 'number') {
            try {
                let readed = await this.readDocumentFirebase({id: idFind});
                if (readed.error) {
                    return {error:`no se encontro el documento con id ${idFind}`}
                } else {
                    const doc = this.query.doc(`${idFind}`);
                    await doc.delete();
                    return {hecho: `el documento con id ${idFind} fue eliminado`};
                }
            } catch (error) {
                return { error: `Error al eliminar el documento: ${error}` };
            }
        } else {
            return { error: `el parametro pasado ${idFind} no es válido` };
        }
    }

    //DELETE ALL
    async deleteAllFirebase(){
        try {
            await this.query.get().then(response => {
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

//let container = new ContenedorFirebase(serviceAccount,'container');

let prueba = {nombre: 'Checho1'};
let cambio = {nombre: 'Checho2'};
let productToAdd = {
    name: "Peluche de Grogu",
    price:80,
    description:"La cosa mas tierna que veras en tu vida y de toda la galaxia basicamente.",
    thumbnail: "https://m.media-amazon.com/images/I/81-ustlVcwL._AC_SX569_.jpg",
    stock: 40,
    code: 568734765699
}

//Conectarse a la base de datos
//container.connectToFirebase();

// Uso del método createFirebase
//container.createFirebase(productToAdd).then((res) => console.log(res));

// Uso del método readDocumentFirebase
//container.readDocumentFirebase({cod: 568734765699}).then((res) => console.log(res));

// Uso del método readAllFirebase
//container.readAllFirebase().then((res) => console.log(res));

// Uso del método updateFirebase
//container.updateFirebase(1, productToAdd).then((res) => console.log(res));

// Uso del método deleteFirebase
//container.deleteFirebase(2).then((res) => console.log(res));

// Uso del método deleteAllFirebase
//container.deleteAllFirebase().then((res) => console.log(res));

module.exports = ContenedorFirebase;