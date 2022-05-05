const carrito = require('../modules/carrito.js');
const producto = require('../modules/productos.js');
const express = require('express');
const {Router} = express;
const cartRoute = Router();

// MUESTRA LOS PRODUCTOS EN UN CARRITO ESPECÍFICO
cartRoute.get('/:id/productos',(require,response)=>{
    let productList = carrito.showAllFromCart(parseInt(require.params.id));
    response.json(productList);
})

// AÑADE UN NUEVO PRODUCTO AL CARRITO Y SI EL ID DEL CARRITO NO ES PASADO EN EL BODY, CREA UN NUEVO CARRITO AUTOMÁTICAMENTE:
cartRoute.post('/',(require,response)=>{
    let data = require.body;
    let productoAdded;
    if (data.idCart) {
        productoAdded = carrito.addToCart(data.idProductToAdd, data.idCart);
    } else {
        let newCartId = carrito.createCart();
        productoAdded = carrito.addToCart(data.idProductToAdd, newCartId);
    }
    response.json({productoAdded});
})

// AÑADE UN NUEVO PRODUCTO AL CARRITO Y SI EL ID DEL CARRITO NO ES PASADO EN EL BODY, CREA UN NUEVO CARRITO AUTOMÁTICAMENTE:
cartRoute.post('/:id/productos/:id_prod',(require,response)=>{
    let idProduct = require.params.id_prod;
    let idCart = require.params.id;
    productoAdded = carrito.addToCart(idProduct, idCart);
    response.json({productoAdded});
})

// ELIMINAR UN CARRITO ENTERO:
cartRoute.delete('/:id',(require,response)=>{
    let id = parseInt(require.params.id);
    let str = carrito.deleteById(id);
    response.json(str);
})

// ELIMINAR UN PRODUCTO DE UN CARRITO:
cartRoute.delete('/:id/productos/:id_prod',(require,response)=>{
    let idCart = parseInt(require.params.id);
    let idProduct = parseInt(require.params.id_prod);
    let yeizon = carrito.deleteFromCart(idProduct,idCart);
    response.json(yeizon);
})

module.exports = cartRoute;