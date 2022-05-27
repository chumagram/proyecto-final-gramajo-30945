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
            console.log(this.workFile,' está vacío.');
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
            return object.id;
        } catch(error) {
            return error;
        }
    }

    //READ ONE
    readById(number){
        let objectAux;
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        array.forEach( item => {
            if(item.id == number){
                objectAux = item;
            }
        });
        if(objectAux === undefined){
            console.log(`El ID ${number} no existe.`);
            return { error : 'producto no encontrado' }
        } else {
            console.log('Se devolvió el objeto solicitado con exito.\n');
            return objectAux;
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
    updateById(numero, objeto){
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let indexObj = array.findIndex(element => element.id === numero);
        if (indexObj == -1){
            console.log(`El producto con id ${numero} no existe`);
            return { error : 'producto no encontrado' }
        } else {
            objeto.id = numero;
            array[indexObj] = objeto;
            fs.writeFileSync(this.workFile, JSON.stringify(array,null,2));
            console.log(`Objeto con ID ${numero} actualizado correctamente`);
            return objeto;
        }
    }

    //DELETE ONE
    deleteById(number){
        let array = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let idObject = array.findIndex(object => object.id === number);
        if (idObject === -1){
            console.log(`El indice ${number} no existe`);
            return { error : 'producto no encontrado' }
        } else {
            array.splice(idObject, 1);
            fs.writeFileSync(this.workFile, JSON.stringify(array, null, 2));
            console.log(`El objeto con ID ${number} fue eliminado exitosamente.`);
            return { hecho : `El objeto con ID ${number} fue eliminado exitosamente.` }
        }
    }

    //DELETE ALL
    deleteAll(){
        const arrayVacio = [];
        try {
            fs.writeFileSync(this.workFile, JSON.stringify(arrayVacio));
            console.log('Todos los objetos en',this.workFile,'fueron borrados');
            return { hecho : `¡La lista fue eliminada completamente!`}
        } catch (error) {
            console.log('Error: no se pudo borrar los datos');
        }
    }

}

//let container = new Contenedor('../data/container.json');

let prueba = {
    title: "esto es una prueba"
}

let prueba2 = {
    title: "esto es una actualizacion"
}

// Uso del método "save"
//countainer.save(prueba);

// Uso del método readById
//countainer.readById(4);

// Uso del método readAll
//console.log((container.readAll()));

// Uso del método deleteById
//countainer.deleteById(2);

// Uso del método deleteAll
//libreria.deleteAll();

// Uso del método updateById
//container.updateById(1,prueba2)

module.exports = Contenedor;