const ContenedorMongo = require('../contenedores/ContenedorMongoDb.js');
const Model = require('../mongo/carritoModel.js');
const URL = process.env.MONGODB_URI;
const product = require('./productos/ProductosDaoMongoDb.js');
const myLogs = require('../../utils/logsGenerator');

class CarritoMongo extends ContenedorMongo {
    constructor(model,url){
        super(model,url);
    }

    //CREATE NEW CART
    async createCart(){
        try {
            let cartToAdd = {};
            let newCart = await this.createMongo(cartToAdd);
            return newCart[0].ourId;
        } catch (error) {
            myLogs.showError (error);
            return { error:`ERROR al crear el carrito: ${error}` };
        }
    }

    // READ CART
    async readCart(idCarrito){
        let prop = {ourId: idCarrito} 
        try {
            let cartReaded = await this.readMongo(prop);
            if (cartReaded.length == 0) {
                return {Error: `El carrito ${idCarrito} no existe`};
            } else {
                return cartReaded[0];
            }
        } catch (error) {
            myLogs.showError (error);
            return {Error: `Falla de lectura: ${error}`}
        }
    }

    // UPDATE ADD TO CART
    async addToCart(idProduct,idCarrito){
        // verificaciones ce producto y carrito pasados como parametro
        let idProducto = parseInt(idProduct);
        let idCart = parseInt(idCarrito);
        let productToAdd;
        let cartToUpdate;
        try {
            productToAdd = await product.readMongo({ourId: idProducto});
            cartToUpdate = await this.readMongo({ourId: idCart});
            if (productToAdd.length == 0) {
                myLogs.showError (`carrito no encontrado`);
                return {error: `producto no encontrado`}
            }
            if (cartToUpdate.length == 0){
                myLogs.showError (`carrito no encontrado`);
                return {error: `carrito no encontrado`}
            }
        } catch(error) {
            myLogs.showError (error);
            return {error:`Falla de búsqueda: ${error}`};
        }

        // actualizaciones del carrito
        let cartAux = {listP: cartToUpdate[0].listP};
        let productAux = productToAdd[0];
        let productUpdated = {
            name: productAux.name,
            price: productAux.price,
            description: productAux.description,
            thumbnail: productAux.thumbnail,
            code: productAux.code,
            quantity: 1
        };
        let flag = false;
        try {
            if (cartAux.listP) { // si el carrito ya tenia productos
                cartAux.listP.forEach(element => {
                    if (element.code == productAux.code){
                        element.quantity++;
                        flag = true; 
                    }
                });
                if (flag){ // ya estaba el producto en el carrito
                    await this.updateMongo(idCart,cartAux);
                    return {hecho:`cantidad de producto incremetada en 1`};
                } else { // no estaba el producto en el carrito
                    cartAux.listP.push(productUpdated);
                    await this.updateMongo(idCart,cartAux);
                    return {hecho:`producto añadido al carrito`};
                }
            } else { // si el carrito no tenia productos
                cartAux.listP = [productUpdated];
                await this.updateMongo(idCart,cartAux);
                return {hecho:`producto añadido al carrito`}; 
            }
        } catch (error) {
            myLogs.showError (error);
            return {error:`Falla de actualización: ${error}`};
        }
    }

    // UPDATE DELETE PRODUCT FROM CART
    async deleteFromCart(idProducto, idCart){
        // verificaciones ce producto y carrito pasados como parametro
        let productToDelete;
        let cartToUpdate;
        try {
            productToDelete = await product.readMongo({ourId: idProducto});
            cartToUpdate = await this.readMongo({ourId: idCart});
            if (productToDelete.length == 0) {
                return {error: `el producto ${idProducto} no existe`}
            }
            if (cartToUpdate.length == 0){
                return {error: `carrito no encontrado`}
            }
        } catch(error) {
            myLogs.showError (error);
            return {error:`Falla de búsqueda: ${error}`};
        }

        // actualizaciones del carrito
        let cartAux = cartToUpdate[0];
        let codeToDelete = productToDelete[0].code;
        try {
            if (cartAux.listP) { // si el carrito ya tenia productos
                let index = cartAux.listP.findIndex((element) => {
                    if (codeToDelete == element.code) return true;
                });
                if ((index == -1)) { // el producto existe pero no en el carrito
                    return {error:`ATENCIÓN: el producto ${idProducto} no se encontró en el carrito`};
                } else if (cartAux.listP[index].quantity > 1) { // mas de un producto
                    cartAux.listP[index].quantity--;
                    await this.updateMongo(idCart,cartAux);
                    return { hecho: `la cantidad del producto fue mermada en 1`}
                } else if(cartAux.listP[index].quantity == 1) { // si había solo un producto
                    cartAux.listP.splice(index,1);
                    await this.updateMongo(idCart,cartAux);
                    return { hecho: `el producto fue eliminado del carrito ${idCart}`}
                }
            } else { // si el carrito no tenia productos
                return {error:`ATENCIÓN: el carrito no tenia productos`};
            }
        } catch (error) {
            myLogs.showError (error);
            return {error:`ATENCIÓN: falla de actualización: ${error}`};
        }
    }

    // UPDATE DELETE ALL THE PRODUCTS FROM CART
    async deleteAllFromCart(idCart){
        let cartToUpdate;
        try {
            cartToUpdate = await this.readMongo({ourId: idCart});
            if (cartToUpdate.length == 0) {
                return {Error: `El carrito ${idCart} no existe`}
            }
        } catch (error) {
            myLogs.showError (error);
            return {Error: `Falla en la busqueda: ${error}`}
        }

        try {
            cartToUpdate[0].listP = [];
            return await this.updateMongo(idCart, cartToUpdate[0])
        } catch (error) {
            myLogs.showError (error);
            return {Error:`Falló la eliminación de todos los productos`}
        }
    }

    // DELETE CART
    async deleteCart(idCart){
        try {
            let retorno = await this.deleteMongo(idCart);
            if (retorno.deletedCount == 0) {
                return {Error: `El carrito ${idCart} no existe`};
            } else {
                return {Hecho: `Carrito ${idCart} eliminado con éxito`};
            } 
        } catch (error) {
            myLogs.showError (error);
            return {Error: `Falla al eliminar el carrito: ${error}`};
        }
    }
}

let changuitoMongo = new CarritoMongo(Model,URL);
let prueba = {};

// PRUEBA DE CONEXIÓN
changuitoMongo.connectToDB();

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//changuitoMongo.createCartMongo(prueba).then((res) => console.log(res));

//PRUEBA DE MODULO QUE DEVUELVE UN CARRITO
//changuitoMongo.readCart(1).then((res) => console.log(res));

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//changuitoMongo.addToCartMongo(1,2).then((res) => console.log(res)); //{idProducto, idCart}

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//changuitoMongo.deleteFromCartMongo(1,1).then((res) => console.log(res)); //{idProducto, idCart}

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
//changuitoMongo.deleteAllFromCartMongo(1).then((res) => console.log(res));

// PREUBA DE MODULO QUE ELIMINA UN CARRITO COMO TAL
//changuitoMongo.deleteCartMongo(4).then((res) => console.log(res));

module.exports = changuitoMongo;