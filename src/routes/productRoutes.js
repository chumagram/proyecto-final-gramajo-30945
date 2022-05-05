const productos = require('../modules/productos.js');
const express = require('express');
const {Router} = express;
const productRoute = Router();

productRoute.get('/',(require,response)=>{
    let array = productos.getAll();
    console.log('Todos los productos disponibles:\n',array);
    response.json(array);
})

productRoute.get('/:id',(require,response)=>{
    let objeto = productos.getById(parseInt(require.params.id));
    console.log(objeto);
    response.json(objeto);
})

productRoute.post('/',(require,response)=>{
    if (admin){
        let agregar = require.body;
        console.log('Producto a agregar:\n',agregar);
        let newId = productos.saveProduct(agregar);
        response.send(`Id del producto agregado:${newId}`);
    } else {
        response.send(`Admin:${adminState}->Usted no es un administrador`);
    }
})

productRoute.put('/:id',(require,response)=>{
    if (admin){
        let id = parseInt(require.params.id);
        let actualizar = require.body;
        let newObject = productos.updateProductById(id,actualizar);
        console.log('Objeto actualizado:\n',newObject);
        response.json({'Objeto actualizado': newObject});
    } else {
        response.send(`Admin:${admin}->Usted no es un administrador`);
    }
})

productRoute.delete('/:id',(require,response)=>{
    if(admin){
        let id = parseInt(require.params.id);
        let str = productos.deleteById(id);
        response.json(str);
    } else {
        response.send(`Admin:${admin}->Usted no es un administrador`);
    }
})

productRoute.delete('/',(require,response)=>{
    console.log(admin);
    if (admin){
        let str = productos.deleteAll();
        response.json(str);
    } else {
        response.send(`Admin: ${admin} -> Usted no es un administrador`);
    }
})

module.exports = productRoute;