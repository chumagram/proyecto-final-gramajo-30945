const fs = require('fs');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString()
}

class Contenedor {

    constructor(dir){
        this.workFile = dir;
        this.JSONcheck();
        this.lastID;
    }

    JSONcheck(){
        try {
            fs.readFileSync(this.workFile,'utf-8');
        } catch (error) {
            fs.writeFileSync(this.workFile,'[]');
            console.log(this.workFile,'creado con exito!');
        }

        let array = JSON.parse(fs.readFileSync(this.workFile,'utf-8'));
        let idAux = [];
        array.forEach(element => {
            idAux.push(element.id);
        });
        this.lastID = Math.max(...idAux);
        if(this.lastID === -Infinity){
            this.lastID = 0;
        }
    }
    
    //CREATE
    createDocument(object){
        let array;
        try {
            array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
            this.lastID ++;
            object.id = this.lastID;
            object.timeStamp = timeStamp();
            array.push(object);
        } catch (error) {
            return error;
        }
        
        try {
            fs.writeFileSync(this.workFile, JSON.stringify(array, null, 2));
            return object;
        } catch(error) {
            return {Error: `Error al crear el documento: ${error}`};
        }
    }

    //READ ONE DOCUMENT
    readDocument(objFind){
        let prop,docFound, flagFind = true, flagKey = true;
        for (let key in objFind) {prop = key};
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        array.forEach( element => {
            for (let key in element) {
                if (prop == key) {
                    flagKey = false;
                    if (objFind[key] == element[key]){
                        flagFind = false;
                        docFound = element;
                    }
                }
            }
        });
        if (flagKey){
            return {error: `La propiedad ${prop} no existe en ningún documento`};
        } else if (flagFind){
            return {error: `No se encontró ningún documento con "${prop}: ${objFind[prop]}"`};
        } else {
            return docFound;
        }
    }

    //READ ALL
    readAll(){
        let todo, flag;
        try {
            todo = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
            flag = true;
        } catch (error) {
            flag = false;
        }
        if (flag){
            return todo;
        } else {
            return 'error al mostrar todos los objetos';
        }
    }

    //UPDATE
    updateDocument(numero, objeto) {
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let indexObj = array.findIndex(element => element.id == numero);
        if (indexObj == -1){
            return { error : `el documento con id ${numero} no existe` }
        } else {
            objeto.id = numero;
            array[indexObj] = objeto;
            fs.writeFileSync(this.workFile, JSON.stringify(array,null,2));
            return { hecho: `Documento con id ${numero} actualizado correctamente` };
        }
    }

    //DELETE ONE
    deleteDocument(number){
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let idObject = array.findIndex(object => object.id === number);
        if (idObject === -1){
            return { error : 'documento no encontrado' };
        } else {
            array.splice(idObject, 1);
            fs.writeFileSync(this.workFile, JSON.stringify(array, null, 2));
            console.log(`El objeto con ID ${number} fue eliminado exitosamente.`);
            return { hecho : `El objeto con ID ${number} fue eliminado exitosamente.` };
        }
    }

    //DELETE ALL
    deleteAll(){
        const arrayVacio = [];
        try {
            fs.writeFileSync(this.workFile, JSON.stringify(arrayVacio));
            return { hecho : `¡La lista fue eliminada completamente!` };
        } catch (error) {
            return { error: 'no se pudo borrar los datos' };
        }
    }

}

//let container = new Contenedor(__dirname,'../data/jsonDb/container.json');

let prueba = {
    title: "esto es una prueba"
}

let prueba2 = {
    title: "esto es una actualizacion"
}

// Uso del método "save"
//countainer.save(prueba);

// Uso del método readById
//console.log(container.readDocument({id: 3}));

// Uso del método readAll
//console.log((container.readAll()));

// Uso del método deleteById
//countainer.deleteById(2);

// Uso del método deleteAll
//libreria.deleteAll();

// Uso del método updateById
//container.updateById(1,prueba2)

module.exports = Contenedor;