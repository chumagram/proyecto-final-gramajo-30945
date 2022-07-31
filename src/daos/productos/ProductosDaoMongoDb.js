const ContenedorMongo = require('../../contenedores/ContenedorMongoDb.js');
const Model = require('../../mongo/productoModel.js');
const URL = 'mongodb+srv://chumagram:test1234@cluster0.ar5vn.mongodb.net/store-wars?retryWrites=true&w=majority';

class ProductosMongo extends ContenedorMongo {
    constructor(model,url){
        super(model,url);
        /* this.model == model;
        this.url == url; */
    }

    // CREAR UN NUEVO PRODUCTO SI ES QUE YA NO EXISTE, SINO ACTUALIZA EL STOCK
    async createProduct(productToAdd){
        try {
            let doc = await this.readMongo({code: productToAdd.code});
            if (doc.length == 0) {
                let created = await this.createMongo(productToAdd);
                return { hecho: `Producto con ID ${created[0].ourId} creado con éxito`};
            } else {
                let id = doc[0].ourId;
                productToAdd.stock = doc[0].stock + productToAdd.stock;
                await this.updateMongo(id,productToAdd);
                return { hecho:`el stock del producto ${id} fue actualizado`};
            }
        } catch (error) {
            return { error: `Falla al agregar el Producto: ${error}` }
        }
    }

    // LEER UN PRODUCTO SEGUN SU ID
    async readProduct(id){
        try {
            let readed = await this.readMongo({ourId: id});
            if (readed.length == 0){
                return {error: `No se encontró el producto con id ${id}`}
            } else {
                return readed;
            }
        } catch (error) {
            return {Error: `Falla al agregar el Producto: ${error}`};
        }
    }

    // LEER TODOS LOS PRODUCTOS ALMACENADOS
    async readAllProducts(){
        try {
            let readed = await this.readAllMongo();
            return readed;
        } catch (error) {
            return { error: `Falló la lectura de la lista de productos: ${error}` }
        }
    }

    // ACTUALIZAR UN PRODUCTO SEGUN SI ID
    async updateProduct(idProduct,changes){
        try {
            let updated = await this.updateMongo(idProduct,changes);
            if (updated.modifiedCount == 0) {
                return { error: `No se encontró el producto con id ${idProduct}`};
            } else {
                return { hecho: `el producto con id ${idProduct} fue actualizado`};
            }
        } catch (error) {
            return { error: `Falló la actualización del producto: ${error}`}
        }
    }

    // ELIMINAR UN PRODUCTO SEGÚN SU ID
    async deleteProduct(id){
        try {
            let deleted = await this.deleteMongo(id);
            if (deleted.deletedCount == 0) {
                return { error: `No se encontró el producto con id ${id}`};
            } else {
                return { hecho: `El producto con id ${id} fue eliminado`};
            }
        } catch (error) {
            return { error: `falló la eliminación del producto: ${error}`}
        }
    }

    // ELIMINAR TODOS LOS PRODUCTOS
    async deleteAllProducts(){
        try {
            this.deleteAllMongo();
            return { hecho: 'Se borraron todos los productos'}
        } catch (error) {
            return { error: `falló la eliminación todos los productos: ${error}`}
        }
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

//Conectarse a la base de datos
productMongo.connectToDB();

// MODULO QUE CREA UN PRODUCTO
//productMongo.createProductMongo(productoAux).then((res) => console.log(res));

// MODULO QUE LEE UN PRODUCTO POR ID
//productMongo.readProductMongo(3).then((res) => console.log(res));

// MODULO QUE LEE TODOS LOS PRODUCTOS
//productMongo.readMongo().then((res) => console.log(res));

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS
//productMongo.updateMongo(1,{price: 82}).then((res) => console.log(res));

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID
//productMongo.deleteProductMongo(53).then((res) => console.log(res));

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS
//productMongo.deleteAllProductsMongo().then((res) => console.log(res));

module.exports = productMongo;