const path = require('path');
const mongoose = require('mongoose');
const ContenedorMongo = require('../../contenedores/ContenedorMongoDb.js');
const Model = require('../../models/productoModel.js');
const URL = 'mongodb+srv://chumagram:test1234@cluster0.ar5vn.mongodb.net/store-wars?retryWrites=true&w=majority';

class ProductosFirebase extends ContenedorFirebase {
    constructor(model,url){
        super(model,url);
    }
    
    async createProductFirebase(productToAdd){

    }

    async readProductFirebase(id){

    }

    async readAllProductsFirebase(){

    }

    async updateProductFirebase(idProduct,changes){

    }

    async deleteProductFirebase(){

    }

    async deleteAllProductsFirebase(){

    }
}

let productFirebase = new ProductosFirebase(Model,URL);

let productoAux = {
    name: "Sable laser",
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987234
}

let productToAdd = {
    name: "Peluche de Grogu",
    price:80,
    description:"La cosa mas tierna que veras en tu vida y de toda la galaxia basicamente.",
    thumbnail: "https://m.media-amazon.com/images/I/81-ustlVcwL._AC_SX569_.jpg",
    stock: 40,
    code: 568734765698
}

// MODULO QUE CREA UN PRODUCTO

// MODULO QUE LEE UN PRODUCTO POR ID

// MODULO QUE LEE TODOS LOS PRODUCTOS

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS

//module.exports = productFirebase;