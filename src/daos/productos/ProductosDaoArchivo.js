const path = require('path');
const Contenedor = require('../../contenedores/ContenedorArchivo.js');
const fs = require('fs');

function timeStamp(){
    const date = new Date();
    return date.toLocaleDateString() + " - " + date.toLocaleTimeString()
}

class Productos extends Contenedor {
    constructor(dir){
        super(dir);
    }

    createProduct(productToAdd){
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
    
    readProduct(id){

    }

    readAllProducts(){

    }

    updateProduct(id,changes){
        let rightNow = timeStamp();
        let productos = JSON.parse(fs.readFileSync(this.workFile, 'utf-8'));
        let indexProduct = productos.findIndex(element => element.id === id);
        console.log(indexProduct);
        if (indexProduct == -1){
            console.log(`El producto con id ${id} no existe`);
            return { error : 'producto no encontrado' }
        } else {
            changes.id = id;
            changes.timeStamp = rightNow;
            productos[indexProduct] = changes;
            fs.writeFileSync(this.workFile, JSON.stringify(productos,null,2));
            console.log(`Objeto con ID ${id} actualizado correctamente`);
            return changes;
        }
    }

    deleteProduct(id){

    }

    deleteAllProducts(){
        
    }
}

let product = new Productos(path.join(__dirname,"../../data/productos.json"));

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

// MODULO QUE CREA UN PRODUCTO

// MODULO QUE LEE UN PRODUCTO POR ID

// MODULO QUE LEE TODOS LOS PRODUCTOS

// MODULO QUE ACTUALIZA UN PRODUCTO SEGUN ID Y CAMBIOS

// MODULO QUE ELIMINA UN PRODUCTO SEGÚN SU ID

// MODULO QUE ELIMINA TODOS LOS PRODUCTOS

//module.exports = product;