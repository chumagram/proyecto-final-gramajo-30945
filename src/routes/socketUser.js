const usersMongo = require('../mongo/daos/UsuariosDaoMongo')
const productMongo = require('../mongo/daos/ProductosDaoMongoDb')

async function socketUser (socket, io) {

    let allProducts = await productMongo.readAllProducts();
    socket.emit('productos', allProducts);

    let allMessages = await messageMongo.readAllMessage();
    socket.emit('mensajeria', allMessages);

    // nuevo producto
    socket.on('new-product', async data => {
        await productMongo.createProduct(data);
        let allProd = await productMongo.readAllProducts();
        io.sockets.emit('productos', allProd);
    })

    // nuevo mensaje
    socket.on('new-message', async data => {
        let email = data.email;
        let text = data.text;
        await messageMongo.addMessage(text, email);
        
        let allMsj = await messageMongo.readAllMessage();
        io.sockets.emit('mensajeria', allMsj);
    })

    // verificación de sesión
    socket.on('session-status', async data =>{
        let user = await usersMongo.readUser(data);
        io.sockets.emit('res-session-status', user.session);
    }) 
}

module.exports = {socketUser};