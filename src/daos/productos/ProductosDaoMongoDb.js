const path = require('path');
const mongoose = require('mongoose');
const ContenedorMongo = require('../../contenedores/ContenedorMongoDb.js');
const Model = require('../../models/productoModel.js');
const URL = 'mongodb+srv://chumagram:test1234@cluster0.ar5vn.mongodb.net/store-wars?retryWrites=true&w=majority';

class ProductosMongo extends ContenedorMongo {
    constructor(model,url){
        super(model,url);
    }
    
    async createProductMongo(productToAdd){
        try {
            let doc = await this.readMongo({code: productToAdd.code});
            if (doc.length == 0) {
                return await this.createMongo(productToAdd);
            } else {
                let id = doc[0].ourId;
                productToAdd.stock = doc[0].stock + productToAdd.stock;
                return await this.updateMongo(id,productToAdd);
            }
        } catch (error) {
            return {Error: `Falla al agregar el Producto: ${error}`}
        }
    }

    async readProductMongo(id){

    }

    async readAllProductsMongo(){

    }

    async updateProductMongo(idProduct,changes){

    }

    async deleteProductMongo(){

    }

    async deleteAllProductsMongo(){

    }
}

let productMongo = new ProductosMongo(Model,URL);

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

// PRUEBA DE CONEXIÓN
//product.connectToDB();

// MODULO QUE CREA UN PRODUCTO
//product.createProductMongo(productoAux).then((res) => console.log(res));

// MODULO QUE LEE UN PRODUCTO POR ID

// MODULO QUE LEE TODOS LOS PRODUCTOS

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS

//module.exports = productMongo;