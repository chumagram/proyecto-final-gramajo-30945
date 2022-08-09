const usersMongo = require('../mongo/daos/UsuariosDaoMongo')
const cartMongo = require('../mongo/daos/CarritosDaoMongoDb')
const communication = require('../utils/communication');

async function socketCart (socket, io, transporter, client) {

    // función para emitir carrito
    async function ioEmitCartTable (cartId){
        let cart = await cartMongo.readCart(cartId);
        io.sockets.emit('cart-table', cart.listP);
    }

    // añadir nuevo producto al carrito desde home
    socket.on('add-product-to-cart', async data => {
        let idProduct = data.id
        let mailUser = data.mail
        let user = await usersMongo.readUser(mailUser);
        let cartId;
        if (user.cartId != 0) {
            cartId = user.cartId
        } else {
            cartId = await cartMongo.createCart();
            let updated = await usersMongo.updateUser(mailUser,{cartId: cartId})
        }
        let added = await cartMongo.addToCart(idProduct, cartId);
        if (added.hecho){
            io.sockets.emit('product-added-to-cart', added.hecho);
        } else if (added.error){
            io.sockets.emit('product-added-to-cart', added.error);
        }
    })

    // enviar carrito 
    socket.on('show-cart-table', async mailUser => {
        let user = await usersMongo.readUser(mailUser);
        await ioEmitCartTable(user.cartId);
    })

    // eliminar carrito
    socket.on('delete-product-to-cart', async data => {
        let user = await usersMongo.readUser(data.mail);
        let deleted = await cartMongo.deleteFromCartWithCode(data.code, user.cartId)
        if (deleted.hecho){
            io.sockets.emit('product-deleted-to-cart', deleted.hecho);
        } else if (deleted.error){
            io.sockets.emit('product-deleted-to-cart', deleted.error);
        }
        await ioEmitCartTable(user.cartId);
    })

    // finalizar la compra
    socket.on('finish-shop', async data =>{

        let user = await usersMongo.readUser(data.mail);
        let cart = await cartMongo.readCart(user.cartId);
        
        await usersMongo.updateUser(user.id,{cartId: 0});

        communication.purchaseCompleted(user, cart.listP, transporter, client);
        
        let deleted = await cartMongo.deleteCart(user.cartId);
        if (deleted.hecho){
            io.sockets.emit('purchase-completed', deleted.hecho);
        } else if (deleted.error){
            io.sockets.emit('purchase-completed', deleted.error);
        }
    })
}

module.exports = {socketCart};