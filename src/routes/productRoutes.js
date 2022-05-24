const productos = require('../daos/productos/ProductosDaoArchivo.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const {Router} = express;
const productRoute = Router();

let directorioJson = path.join(__dirname,"../data/usuarios.json");
let admin;

// DEVOLVER TODOS LOS PRODUCTOS
productRoute.get('/',(require,response)=>{
    let array = productos.getAll();
    console.log('Todos los productos disponibles:\n',array);
    response.json(array);
})

// DEVOLVER UN PRODUCTO SEGUN SU ID
productRoute.get('/:id',(require,response)=>{
    let objeto = productos.getById(parseInt(require.params.id));
    console.log(objeto);
    response.json(objeto);
})

// AGREGAR UN NUEVO PRODUCTO (ADMIN)
productRoute.post('/',(require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        let agregar = require.body;
        console.log('Producto a agregar:\n',agregar);
        let newId = productos.saveProduct(agregar);
        response.send(`Id del producto agregado:${newId}`);
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

//ACTUALIZAR UN PRODUCTO SEGUN SU ID (ADMIN)
productRoute.put('/:id',(require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        let id = parseInt(require.params.id);
        let actualizar = require.body;
        let newObject = productos.updateProductById(id,actualizar);
        console.log('Objeto actualizado:\n',newObject);
        response.json({'Objeto actualizado': newObject});
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

// ELIMINAR UN PRODUCTO SEGUN SU ID (ADMIN)
productRoute.delete('/:id',(require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if(admin.adminState){
        let id = parseInt(require.params.id);
        let str = productos.deleteById(id);
        response.json(str);
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

// ELIMINAR TODA LA LISTA DE PRODUCTOS (ADMIN)
productRoute.delete('/',(require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        let str = productos.deleteAll();
        response.json(str);
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

module.exports = productRoute;