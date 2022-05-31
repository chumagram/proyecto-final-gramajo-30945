const productFirebase = require('../productos/ProductosDaoFirebase.js');
const ContenedorFirebase = require ("../../contenedores/ContenedorFirebase.js")
const serviceAccount = require("../../data/store-wars-8dda5-firebase-adminsdk-ibhpt-3955ae495a.json");

class CarritoFirebase extends ContenedorFirebase {
    constructor(serviceAccount,myCollection){
        super(serviceAccount,myCollection);
    }

    // CREATE NEW CART
    async createCart(){
        try {
            let cartToAdd = {};
            let createCarrito = await this.createFirebase(cartToAdd);
            return createCarrito;
        } catch (error) { 
            return {error:`ERROR al crear el carrito: ${error}`};
        }
    }

    // READ CART
    async readCart(idCarrito){
        let prop = {id: idCarrito} 
        try {
            let cartReaded = await this.readDocumentFirebase(prop);
            if (cartReaded.length == 0) {
                return {Error: `El carrito ${idCarrito} no existe`};
            } else {
                return cartReaded;
            }
        } catch (error) {
            return {Error: `Falla de lectura: ${error}`}
        }
    }

    // UPDATE ADD TO CART
    async addToCart(idProduct,idCarrito){
        // verificaciones de producto y carrito pasados como parametro
        let idProducto = parseInt(idProduct);
        let idCart = parseInt(idCarrito);
        let productToAdd;
        let cartToUpdate;
        try {
            productToAdd = await productFirebase.readProduct(idProducto);
            cartToUpdate = await this.readCart(idCart);
            if (productToAdd.error) {
                return {error: `producto no encontrado`}
            }
            if (cartToUpdate.error){
                return {error: `carrito no encontrado`}
            }
        } catch(error) {
            return {error:`Falla de búsqueda: ${error}`};
        }
        
        // actualizaciones del carrito
        let cartAux = cartToUpdate;
        let productAux = productToAdd;
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
                    await this.updateFirebase(idCart,cartAux);
                    return { hecho: `Quiantity aumentada en 1` };
                } else { // no estaba el producto en el carrito
                    cartAux.listP.push(productUpdated);
                    await this.updateFirebase(idCart,cartAux);
                    return { hecho: `producto ${idProducto} agregado al carrito ${idCart}` };
                }
            } else { // si el carrito no tenia productos
                cartAux.listP = [productUpdated];
                await this.updateFirebase(idCart,cartAux);
                return { hecho: `producto ${idProducto} agregado al carrito ${idCart}` };
            }
        } catch (error) {
            return {Error:`Falla de actualización: ${error}`};
        }
    }

    // UPDATE DELETE PRODUCT FROM CART
    async deleteFromCart(idProducto, idCart){
        // verificaciones ce producto y carrito pasados como parametro
        let productToDelete;
        let cartToUpdate;
        try {
            productToDelete = await productFirebase.readProduct(idProducto);
            cartToUpdate = await this.readCart(idCart);
            if (productToDelete.error) {
                return {error: `el producto ${idProducto} no existe`}
            }
            if (cartToUpdate.error){
                return {error: `carrito no encontrado`}
            }
        } catch(error) {
            return {error:`Falla de búsqueda: ${error}`};
        }

        // actualizaciones del carrito
        let cartAux = cartToUpdate;
        let codeToDelete = productToDelete.code;
        try {
            if (cartAux.listP) { // si el carrito ya tenia productos
                let index = cartAux.listP.findIndex((element) => {
                    if (codeToDelete == element.code) return true;
                });
                if ((index == -1)) { // el producto existe pero no en el carrito
                    return {Error:`ATENCIÓN: el producto ${idProducto} no se encontró en el carrito`};
                } else if (cartAux.listP[index].quantity > 1) { // mas de un producto
                    cartAux.listP[index].quantity--;
                    await this.updateFirebase(idCart,cartAux);
                    return { hecho:`quantity mermada en 1`};
                } else if(cartAux.listP[index].quantity == 1) { // si había solo un producto
                    cartAux.listP.splice(index,1);
                    await this.updateFirebase(idCart,cartAux);
                    return { hecho:`producto ${idProducto} eliminado del carrito ${idCart}`};
                }
            } else { // si el carrito no tenia productos
                return {Error:`ATENCIÓN: el carrito no tenia productos`};
            }
        } catch (error) {
            return {Error:`ATENCIÓN: falla de actualización: ${error}`};
        }
    }

    // UPDATE DELETE ALL THE PRODUCTS FROM CART
    async deleteAllFromCart(idCart){
        let cartToUpdate;
        try {
            cartToUpdate = await this.readCart(idCart);
            if (cartToUpdate.error) {
                return {error: `El carrito ${idCart} no existe`}
            }
        } catch (error) {
            return {error: `Falla en la busqueda: ${error}`}
        }

        try {
            cartToUpdate.listP = [];
            await this.updateFirebase(idCart, cartToUpdate);
            return { hecho: `todos los productos fueron borrados del carrito ${idCart}`}
        } catch (error) {
            return {error:`Falló la eliminación de todos los productos`}
        }
    }

    // DELETE CART
    async deleteCart(idCart){
        try {
            let deleted = await this.deleteFirebase(idCart);
            if (deleted.error) {
                return {hecho: `El carrito ${idCart} no existe`};
            } else {
                return {hecho: `Carrito ${idCart} eliminado con éxito`};
            } 
        } catch (error) {
            return {error: `Falla al eliminar el carrito: ${error}`};
        }
    }
}

let changuitoFirebase = new CarritoFirebase(serviceAccount,'carritos');
let prueba = {};

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//changuitoFirebase.createCartFirebase().then((res) => console.log(res));

//PRUEBA DE MODULO QUE DEVUELVE UN CARRITO
//changuitoFirebase.readCartFirebase(67).then((res) => console.log(res));

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//changuitoFirebase.addToCartFirebase(2,1).then((res) => console.log(res));

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//changuitoFirebase.deleteFromCartFirebase(1,1).then((res) => console.log(res));

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
//changuitoFirebase.deleteAllFromCartFirebase(123).then((res) => console.log(res));

// PREUBA DE MODULO QUE ELIMINA UN CARRITO COMO TAL
//changuitoFirebase.deleteCartFirebase(6).then((res) => console.log(res));

module.exports = changuitoFirebase;