const Contenedor = require('../../contenedores/ContenedorSQLite');
const SqLiteOptions = require('../../data/dbSql/config.js');

class ProductosSQL extends Contenedor {
    constructor(options, tableName){
        super(options, tableName);
    }

    //CREAR UN NUEVO PRODUCTO SI ES QUE YA NO EXISTE, SINO ACTUALIZA EL STOCK
    async createProduct(productToAdd){
        try {
            if (productToAdd.name 
                && productToAdd.price
                && productToAdd.description
                && productToAdd.thumbnail
                && productToAdd.stock
                && productToAdd.code) {
                let param = {code: productToAdd.code};
                let alreadyExist = await this.readSQL(param);
                if (alreadyExist == null) {
                    let created = await this.createSQL(productToAdd);
                    if (created.error) {
                        return created.error
                    } else {
                        return { hecho: `Producto con ID ${created} creado con éxito`};
                    }
                } else {
                    let newStock = productToAdd.stock + alreadyExist.stock;
                    alreadyExist.stock = newStock;
                    await this.updateSQL({id: alreadyExist.id}, alreadyExist);
                    return { hecho:`el stock del producto ${alreadyExist.id} fue actualizado`};
                }
            } else {
                return {error: `El producto pasado está corrompido`};
            }
        } catch(error) {
            return {error: `Falla al crear el producto: ${error}`};
        }
    }

    //LEER UN PRODUCTO SEGUN SU ID
    async readProduct(idToFind){
        try {
            let readed = await this.readSQL({id: idToFind})
            if (readed.error) {
                return {error:`No se encontró ningún producto con id ${idToFind}`}
            } else {
                return readed;
            }
        } catch (error) {
            return {error:'Falla al buscar el producto'};
        }
    }

    //LEER TODOS LOS PRODUCTOS ALMACENADOS
    async readAllProducts(){
        let readed = await this.readAllSQL();
        return readed;
    }

    //ACTUALIZAR UN PRODUCTO SEGUN SI ID
    async updateProduct(id,changes){
        try {
            if (changes.name 
                || changes.price
                || changes.description
                || changes.thumbnail
                || changes.stock
                || changes.code){
                    let productToUpdate = await this.readSQL({id: id})
                    for (let key in changes) {
                        productToUpdate[key] = changes[key];
                    }
                    let updated = await this.updateSQL({id: id}, productToUpdate);
                    return { hecho: `el producto con id ${updated} fue actualizado`};
                } else {
                    return { error: 'No se puede actualizar con los parametros pasados'}
                }
        } catch (error) {
            return { error: 'Falló la actualización del producto'}
        }
    }

    //ELIMINAR UN PRODUCTO SEGUN SU ID
    async deleteProduct(id){
        try {
            let deleted = await this.deleteSQL(id);
            if (deleted.error) {
                return { error : 'producto no encontrado' };
            } else {
                return { hecho : `El producto con id ${id} fue eliminado` };
            }
        } catch (error) {
            return { error: 'Falló la eliminación del producto'};
        }
    }

    //ELIMINAR TODOS LOS PRODUCTOS ALMACENADOS
    async deleteAllProducts(){
        try {
            await this.deleteAllSQL();
            return { hecho: 'toda la lista de productos fue eliminada'}
        } catch (error) {
            return { error: 'Falló la eliminación de todos los productos'}
        }
    }
}

let product = new ProductosSQL(SqLiteOptions, 'productos');

let productoAux = {
    name: "Sable laser",
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987234
}

let productoCorrompido = {
    price:120,
    description:"Tremendo sable laser re fachero, original que lo uso darth vader para exterminar jedis en la orden 66.",
    thumbnail: "https://as.com/meristation/imagenes/2021/05/05/betech/1620209195_059699_1620209343_sumario_grande.jpg",
    stock: 10,
    code: 123456987234
}

let anotherProduct = {
    name: "Peluche de Grogu",
    price:80,
    description:"La cosa mas tierna que veras en tu vida y de toda la galaxia basicamente.",
    thumbnail: "https://m.media-amazon.com/images/I/81-ustlVcwL._AC_SX569_.jpg",
    stock: 50,
    code: 568734765698
}

// MODULO QUE CREA UN PRODUCTO
//product.createProduct(anotherProduct).then((res) => console.log(res));

// MODULO QUE LEE UN PRODUCTO POR ID
//product.readProduct(2).then((res) => console.log(res));

// MODULO QUE LEE TODOS LOS PRODUCTOS
//product.readAllProducts().then((res) => console.log(res));

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS
//product.updateProduct(1,{stock:10,code:111122223333}).then((res) => console.log(res));

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID
//product.deleteProduct(1).then((res) => console.log(res));

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS
//product.deleteAllProducts().then((res) => console.log(res));

module.exports = product;