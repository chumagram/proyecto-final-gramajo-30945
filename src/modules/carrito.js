const Contenedor = require('./container.js');
const product = require('./productos.js');
const fs = require('fs');

class Carrito extends Contenedor {
    constructor(dir){
        super(dir);
    }

    createCart(){
        
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
}

let carrito = new Carrito('../data/carrito.json');

console.log(carrito.addToCart(90,1));