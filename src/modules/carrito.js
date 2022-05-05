const path = require('path');
const Contenedor = require('./container.js');
const product = require('./productos.js');
const fs = require('fs');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString()
}

class Carrito extends Contenedor {
    constructor(dir){
        super(dir);
    }

    createCart(){
        let cartList;
        try {
            cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        } catch(error) {
            console.log('Error: no se encontró carritos.json');
            return {Error: "no se encontró carritos.json"};
        }
        
        let cartToAdd = {id: this.lastID, timeStamp: timeStamp()};
        cartList.push(cartToAdd);

        try {
            fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
            console.log(`Exito: carrito añadido a carrito.json`);
            return cartToAdd.id;
        } catch(error) {
            console.log('Error: no se pudo añadir el carrito');
            return {Error: 'Error: no se pudo añadir el carrito'};
        }
    }

    addToCart(idProducto,idCart){
        let productToAdd = product.getById(idProducto);
        let cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let auxList = [];
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                if (carrito.listaP) auxList = carrito.listaP;
                let flag = true;
                auxList.forEach(producto =>{
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
                carrito = Object.assign(carrito, { listaP: auxList });
            }
        });
        if (productToAdd.error){
            return productToAdd.error
        } else {
            try {
                fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
                console.log(`Exito: producto añadido al carrito`);
                return { Hecho: `Producto añadido al carrito ${idCart}: ${productToAdd}`}
            } catch(error) {
                console.log('Error: no se pudo añadir al carrito');
                return { Error:`Falla al añadir el producto al carrito`}
            }
        }
    }

    showAllFromCart(idCarrito){
        let cartAux = this.getById(idCarrito);
        if (cartAux.listaP){
            return cartAux.listaP
        } else if (cartAux.error){
            return cartAux.error
        }
    }

    deleteFromCart(idProducto, idCart){
        let cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let flagNoProduct = false;
        let flagNoCart = true;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                let indexProduct = carrito.listaP.findIndex(producto => producto.id === idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagNoProduct = true;
                } else {
                    carrito.listaP.forEach(producto => {
                        if(producto.id == idProducto){
                            if(producto.quantity > 1){
                                producto.quantity--;
                            } else if (producto.quantity = 1) {
                                carrito.listaP.splice(indexProduct, 1);
                            }
                        }
                    });
                }
                flagNoCart = false;
            }
        });
        if (flagNoProduct) {
            console.log(`Error: Producto ${idProducto} no encontrado en el carrito`);
            return {Error:`Error: Producto ${idProducto} no encontrado en el carrito`}
        } else if (flagNoCart){
            console.log(`Error: El carrito ${idCart} no existe`);
            return {Error:`Error: El carrito ${idCart} no existe`}
        } else {
            try {
                fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
                console.log(`ATENCIÓN: producto eliminado del carrito`);
                return {Hecho: 'ATENCIÓN: producto eliminado del carrito'}
            } catch(error) {
                console.log('ERROR al eliminar el producto del carrito');
                return {Error: "ERROR al eliminar el producto del carrito"}
            }
        }
    }

    deleteAllFromCart(idCart){
        let cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let indexCart = cartList.findIndex(carrito => carrito.id === idCart);
        let flag = false;
        if(indexCart == -1){
            flag = true;
        } else {
            cartList.forEach( carrito => {
                if(carrito.id == idCart){
                    carrito.listaP = [];
                }
            });
        }
        if (flag){
            console.log("Error: Carrito no encontrado");
            return {Error: "Carrito no encontrado"}
        } else {
            try {
                fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
                console.log(`ATENCIÓN: todos los productos eliminados del carrito`);
            } catch(error) {
                console.log('ERROR al eliminar la lista de productos');
            }
        }
    }
}

let changuito = new Carrito(path.join(__dirname,"../data/carrito.json"));

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//console.log(carrito.addToCart(90,1));

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//carrito.createCart();

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//carrito.deleteFromCart(1,1);

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
//carrito.deleteAllFromCart(2);

//RPUEBA DE MODULO QUE MUESTRA TODOS LOS PRODUCTOS EN UN CARRITOS
//console.log(changuito.showAllFromCart(2));

module.exports = changuito;