const productMongo = require('../mongo/daos/ProductosDaoMongoDb')

async function socketHome (socket, io) {

    async function ioEmitProducts (){
        let allProd = await productMongo.readAllProducts();
        io.sockets.emit('productos', allProd);
    }

    // mostrar los producto a pedido de home
    socket.on('show-products', async data => {
        await ioEmitProducts();
    })

    // nuevo producto
    socket.on('new-product', async data => {
        let added = await productMongo.createProduct(data);
        if (added.hecho) {
            io.sockets.emit('product-added', added.hecho);
            await ioEmitProducts ();
        } else if (added.update){
            io.sockets.emit('product-added', added.update);
        } else {
            io.sockets.emit('product-added', added.error);
        }
    })

    // actualizar producto
    socket.on('upd-product', async data => {
        let id = data.id;
        let changes = data.changes;
        let updated = await productMongo.updateProduct(id,changes);
        if (updated.hecho){
            io.sockets.emit('product-updated', updated.hecho);
            await ioEmitProducts ();
        } else if (updated.notFound){
            io.sockets.emit('product-updated', updated.notFound);
        } else {
            io.sockets.emit('product-updated', updated.error);
        }
    })

    // eliminar producto
    socket.on('del-product', async data => {
        let id = data.id;
        let deleted = await productMongo.deleteProduct(id);
        if (deleted.hecho){
            io.sockets.emit('product-deleted', deleted.hecho);
            await ioEmitProducts (socket, io);
        } else if (deleted.notFound){
            io.sockets.emit('product-deleted', deleted.notFound);
        } else {
            io.sockets.emit('product-deleted', deleted.error);
        }
    })
}

module.exports = {socketHome};