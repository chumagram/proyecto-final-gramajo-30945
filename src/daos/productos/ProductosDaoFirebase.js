const serviceAccount = require("../../data/store-wars-8dda5-firebase-adminsdk-ibhpt-3955ae495a.json");
const ContenedorFirebase = require ("../../contenedores/ContenedorFirebase.js")

class ProductosFirebase extends ContenedorFirebase {
    constructor(serviceAccount,myCollection){
        super(serviceAccount,myCollection);
    }

    // CREAR UN NUEVO PRODUCTO SI ES QUE YA NO EXISTE, SINO ACTUALIZA EL STOCK
    async createProduct(productToAdd){
        try {
            if (productToAdd.name 
                && productToAdd.price
                && productToAdd.description
                && productToAdd.thumbnail
                && productToAdd.stock
                && productToAdd.code){
                    let found = await this.readDocumentFirebase({code:productToAdd.code});
                    if (found.code == productToAdd.code) {
                        productToAdd.stock = productToAdd.stock + found.stock;
                        await this.updateFirebase(found.id, productToAdd);
                        return { hecho: `Se actualizó el stock del producto ${found.id}` };
                    } else {
                        let idCreated = await this.createFirebase(productToAdd);
                        return { hecho: `se creó un nuevo producto con ID ${idCreated}` };
                    }
                } else {
                    return { error: `El producto pasado está corrompido` };
                }
        } catch (error) {
            return { error: `Falló la creación de un producto: ${error}` };
        }
    }

    // LEER UN PRODUCTO SEGUN SU ID
    async readProduct(idToFind){
        try {
            let readed = await this.readDocumentFirebase({id: idToFind});
            if (readed.error) {
                return { error: `No se encontro porducto con id ${idToFind}`};
            } else {
                return readed;
            }
        } catch (error) {
            return { error: `Falló la lectura del producto`};
        }
    }

    // LEER TODOS LOS PRODUCTOS ALMACENADOS
    async readAllProducts(){
        try {
            return await this.readAllFirebase();
        } catch (error) {
            return { error: `Falló la lectura de la lista de productos`};
        }
    }

    // ACTUALIZAR UN PRODUCTO SEGUN SI ID
    async updateProduct(idProduct,changes){
        try {
            if (changes.name 
            || changes.price
            || changes.description
            || changes.thumbnail
            || changes.stock
            || changes.code) {
                let updated = await this.updateFirebase(idProduct,changes);
                if (updated.error) {
                    return { error: `no se encontró el producto con ID ${idProduct}` };
                } else {
                    return { hecho: `producto con id ${idProduct} actualizado` };
                }
            }
            else {
                return { error: 'las propiedades no estan definidas' };
            }
        } catch (error) {
            return { error: 'falló la actualización del producto' }
        }
    }

    // ELIMINAR UN PRODUCTO SEGUN SU ID
    async deleteProduct(idFind){
        try {
            let deleted = await this.deleteFirebase(idFind);
            return deleted;
        } catch (error) {
            return {error:'falló la eliminación del producto'};
        }
    }

    // ELIMINAR TODOS LOS PRODUCTOS
    async deleteAllProducts(){
        let deleted = await this.deleteAllFirebase();
        if (deleted == true) {
            return { hecho:'se eliminaron todos los productos' };;
        } else {
            return { error:'falló la eliminación de todos los productos' };
        }
    }
}

let productFirebase = new ProductosFirebase(serviceAccount,'productos');

let productoAux = {
    name: "Sable laser",
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987235
};

let productoAux2 = {pric: 200};

let productToAdd = {
    name: "Peluche de Grogu",
    price:80,
    description:"La cosa mas tierna que veras en tu vida y de toda la galaxia basicamente.",
    thumbnail: "https://m.media-amazon.com/images/I/81-ustlVcwL._AC_SX569_.jpg",
    stock: 40,
    code: 568734765699
};

// MODULO QUE CREA UN PRODUCTO
//productFirebase.createProductFirebase(productoAux).then((res) => console.log(res));

// MODULO QUE LEE UN PRODUCTO POR ID
//productFirebase.readProductFirebase(2).then((res) => console.log(res));

// MODULO QUE LEE TODOS LOS PRODUCTOS
//productFirebase.readAllProductsFirebase().then((res) => console.log(res));

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS
//productFirebase.updateProductFirebase(1,productoAux2).then((res) => console.log(res));

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID
//productFirebase.deleteProductFirebase(1).then((res) => console.log(res));

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS
//productFirebase.deleteAllFirebase().then((res) => console.log(res));

module.exports = productFirebase;