const path = require('path');
const Contenedor = require('../../contenedores/ContenedorArchivo.js');
const product = require('../productos/ProductosDaoArchivo.js');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString()
}

class Carrito extends Contenedor {
    constructor(dir){
        super(dir);
    }

    //CREATE NEW CART
    createCart(){
        try {
            let cartToAdd = {};
            let createCarrito = this.createDocument(cartToAdd);
            const okReturn = `carrito con id ${createCarrito} creado con éxito`;
            console.log(okReturn);
            return okReturn;
        } catch (error) { 
            const errReturn = `ERROR al crear el carrito: ${error}`;
            console.log(errReturn);
            return errReturn;
        }
    }

    // READ CART
    readCart(idCarrito){
        let cartAux = this.readById(idCarrito);
        if (cartAux.id){
            return cartAux
        } else if (cartAux.error){
            return {Error: "carrito no encontrado"}
        }
    }

    // UPDATE ADD TO CART
    addToCart(idProducto,idCart){
        let productToAdd = product.readById(idProducto);
        let cartList, flagCarrito = true, auxList = [];

        try {
            cartList = this.readAll();
        } catch(error) {
            return {Error:`ERROR al listar los carritos: ${error}`};
        }

        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                if (carrito.listaP) auxList = carrito.listaP;
                let flag = true;
                auxList.forEach(producto => {
                    if (producto.id == productToAdd.id) {
                        producto.quantity+=1;
                        flag = false;
                        carrito.timeStamp = timeStamp();
                    }
                })
                if (flag){
                    productToAdd.quantity = 1;
                    if (productToAdd.stock){
                        delete productToAdd.stock
                        delete productToAdd.timeStamp
                    }
                    auxList.push(productToAdd);
                    carrito.timeStamp = timeStamp();
                }
                cartUpdated = Object.assign(carrito, { listaP: auxList });
                flagCarrito = false;
            }
        });

        if (productToAdd.error){
            return productToAdd.error
        }else if (flagCarrito){
            return {Error:`Carrito ${idCart} no encontrado`}
        } else {
            try {
                this.updateById(idCart,cartUpdated);
                console.log(`Exito: producto añadido al carrito`);
                return { Hecho: `Producto añadido al carrito ${idCart} exitosamente`}
            } catch(error) {
                console.log('Error: no se pudo añadir al carrito');
                return { Error:`Falla al añadir el producto al carrito`}
            }
        }
    }

    // UPDATE DELETE PRODUCT FROM CART
    deleteFromCart(idProducto, idCart){
        let cartList = this.readAll();
        let flagProduct = true;
        let flagNoCart = true;
        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                flagNoCart = false;
                let indexProduct = carrito.listaP.findIndex(producto => producto.id === idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagProduct = false;
                } else {
                    carrito.listaP.forEach(producto => {
                        if(producto.id == idProducto){
                            if(producto.quantity > 1){
                                producto.quantity--;
                            } else if (producto.quantity = 1) {
                                carrito.listaP.splice(indexProduct, 1);
                            }
                        }
                        cartUpdated = carrito;
                    });
                }
            }
        });

        if (!flagProduct) {
            return {Error:`Error: Producto ${idProducto} no encontrado en el carrito`}
        } else if (flagNoCart){
            return {Error:`Error: El carrito ${idCart} no existe`}
        } else {
            try {
                this.updateById(idCart,cartUpdated)
                return {Hecho: 'ATENCIÓN: producto eliminado del carrito'}
            } catch(error) {
                return {Error: "ERROR al eliminar el producto del carrito"}
            }
        }
    }

    // UPDATE DELETE ALL THE PRODUCTS FROM CART
    deleteAllFromCart(idCart){
        let cartList = this.readAll();
        let flag = true;
        let cartUpdated;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                carrito.listaP = [];
                flag = false
                cartUpdated = carrito;
            }
        });

        if (flag){
            return {Error: "Carrito no encontrado"}
        } else {
            try {
                this.updateById(idCart,cartUpdated);
                return {Hecho: `ATENCIÓN: todos los productos eliminados del carrito ${idCart}`};
            } catch(error) {
                return {Error: `Falló eliminar la lista de productos del carrito ${idcart}`};
            }
        }
    }

    // DELETE CART
    deleteCart(idCart){
        try {
            let retorno = this.deleteById(idCart);
            return retorno;
        } catch (error) {
            return {Error: `Falló eliminar el carrito ${idCart}: ${error}`};
        }
    }
}

let changuito = new Carrito(path.join(__dirname,"../../data/carrito.json"));

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//changuito.createCart();

//RPUEBA DE MODULO QUE MUESTRA TODOS LOS PRODUCTOS EN UN CARRITOS
//console.log(changuito.readCart(4));

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//console.log(changuito.addToCart(3,4)); //{idProducto: 3, idCart: 4}

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//console.log(changuito.deleteFromCart(1,1));

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
//console.log(changuito.deleteAllFromCart(3));

// PREUBA DE MODULO QUE ELIMINA UN CARRITO COMO TAL
//console.log(changuito.deleteCart(4));

module.exports = changuito;