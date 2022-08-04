const express = require('express');
const {Router} = express;
const cartRoute = Router();

// CREAR UN NUEVO CARRITO CON SU PRIMER PRODUCTO:
cartRoute.post('/', async (require,response)=>{
    let data = require.body;
    let newCart;
    await carritos.createCart().then((res) => newCart = res);
    if (typeof newCart == 'number') {
        await carritos.addToCart(data.idProductToAdd, newCart).then((res)=>{
            console.log(res);
            response.json(res);
        });
    }
})

// AÑADE UN NUEVO PRODUCTO AL CARRITO:
cartRoute.post('/:id/productos/:id_prod', async (require,response)=>{
    let idProduct = require.params.id_prod;
    let idCart = require.params.id;
    await carritos.addToCart(idProduct, idCart).then((res)=>{
        console.log(res);
        response.json(res);
    });
})

// MUESTRA LOS PRODUCTOS EN UN CARRITO ESPECÍFICO
cartRoute.get('/:id/productos', async (require,response)=>{
    let idCartToFind = parseInt(require.params.id);
    await carritos.readCart(idCartToFind).then((res)=>{
        console.log(res);
        response.json(res);
    });
})

// ELIMINAR UN CARRITO ENTERO:
cartRoute.delete('/:id', async (require,response)=>{
    let id = parseInt(require.params.id);
    await carritos.deleteCart(id).then((res)=>{
        console.log(res);
        response.json(res);
    });
})

// ELIMINAR UN PRODUCTO DE UN CARRITO:
cartRoute.delete('/:id/productos/:id_prod', async (require,response)=>{
    let idCart = parseInt(require.params.id);
    let idProduct = parseInt(require.params.id_prod);
    await carritos.deleteFromCart(idProduct,idCart).then((res)=>{
        console.log(res);
        response.json(res);
    });
})

module.exports = cartRoute;