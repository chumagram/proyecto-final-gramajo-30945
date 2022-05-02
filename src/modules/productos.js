const Contenedor = require('./container.js');

class Productos extends Contenedor {
    constructor(dir){
        super(dir);
    }
}

let productos = new Productos('../data/productos.json');
module.exports = productos;