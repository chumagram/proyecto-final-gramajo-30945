const path = require('path');
const Contenedor = require('./container.js');
const fs = require('fs');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString()
}

class Productos extends Contenedor {
    constructor(dir){
        super(dir);
    }

    saveProduct(productToAdd){
        let rightNow = timeStamp();
        let productos = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let flag = true;
        productos.forEach(producto=>{
            if (producto.code == productToAdd.code){
                producto.stock += productToAdd.stock;
                flag = false;
                producto.timeStamp = rightNow;
                productToAdd.id = producto.id;
            }
        });
        if (flag){
            this.lastID ++;
            productToAdd.id = this.lastID;
            productToAdd.timeStamp = rightNow;
            productos.push(productToAdd);
        }

        try {
            fs.writeFileSync(this.workFile, JSON.stringify(productos, null, 2));
            console.log(`Exito: añadido a ${this.workFile}`);
            console.log(`ID asignado: ${productToAdd.id}`);
            return productToAdd.id;
        } catch(error) {
            console.log('Error: no se pudo guardar el objeto');
        }
    }
    
    updateProductById(idProduct,product){
        let rightNow = timeStamp();
        let productos = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let indexProduct = productos.findIndex(element => element.id === idProduct);
        console.log(indexProduct);
        if (indexProduct == -1){
            console.log(`El producto con id ${idProduct} no existe`);
            return { error : 'producto no encontrado' }
        } else {
            product.id = idProduct;
            product.timeStamp = rightNow;
            productos[indexProduct] = product;
            fs.writeFileSync(this.workFile, JSON.stringify(productos,null,2));
            console.log(`Objeto con ID ${idProduct} actualizado correctamente`);
            return product;
        }
    }
}

let product = new Productos(path.join(__dirname,"../data/productos.json"));

let productoAux = {
    name: "Sable laser",
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

// MODULO QUE AGREGA UN PREODUCTO NUEVO A LA LISTA DE PRODUCTOS
//product.saveProduct(anotherProduct);

// MODULO QUE ACTUALIZA UN PRODUCTO
//product.updateProductById(2,productoAux);

module.exports = product;