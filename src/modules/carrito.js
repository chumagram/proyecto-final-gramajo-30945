const Contenedor = require('./container.js');
const product = require('./productos.js');
const fs = require('fs');

class Carrito extends Contenedor {
    constructor(dir){
        super(dir);
    }

    createCart(){
        const date = new Date();
        const rightNow = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        this.lastID++;
        let cartList;

        try {
            cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        } catch(error) {
            console.log('Error: no se encontró carritos.json');
            return {Error: "no se encontró carritos.json"};
        }
        
        let cartToAdd = {
            id: this.lastID,
            timeStamp: rightNow
        };

        cartList.push(cartToAdd);

        try {
            fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
            console.log(`Exito: carrito añadido a carrito.json`);
        } catch(error) {
            console.log('Error: no se pudo añadir el carrito');
            return {Error: 'Error: no se pudo añadir el carrito'}
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
                    }
                })
                if (flag){
                    productToAdd.quantity = 1;
                    auxList.push(productToAdd);
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
            } catch(error) {
                console.log('Error: no se pudo añadir al carrito');
            }
        }
    }

    deleteFromCart(idProducto, idCart){
        let cartList = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let flagNoEntry = false;
        cartList.forEach( carrito => {
            if(carrito.id == idCart){
                let indexProduct = carrito.listaP.findIndex(producto => producto.id === idProducto);
                if (indexProduct == -1 || carrito.listaP.length == 0){
                    flagNoEntry = true;
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
            }
        });
        if (flagNoEntry) {
            console.log("Error: Producto no encontrado en el carrito");
            return {Error: "Producto no encontrado en el carrito"}
        } else {
            try {
                fs.writeFileSync(this.workFile, JSON.stringify(cartList, null, 2));
                console.log(`ATENCIÓN: producto eliminado del carrito`);
            } catch(error) {
                console.log('ERROR al eliminar el producto del carrito');
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

let carrito = new Carrito('../data/carrito.json');

// PRUEBA DE MODULO QUE AÑADE PRODUCTOS A UN CARRITO
//console.log(carrito.addToCart(90,1));

// PRUEBA DE MODULO QUE CREA UN CARRITO NUEVO
//carrito.createCart();

// PRUEBA DE MODULO QUE ELIMINA UN PRODUCTO DE UN CARRITO
//carrito.deleteFromCart(1,1);

//PRUEBA DE MODULO QUE ELIMINA TODOS LOS PRODUCTOS DEL CARRITOS
carrito.deleteAllFromCart(2);