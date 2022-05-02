const contenedor = require('./src/modules/container.js');
const express = require('express');
const {Router} = express;

const app = express();
const routerP = Router();
const routerC = Router();
const PORT = 8080;

const server = app.listen(PORT,()=>{
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})
server.on("error", error => console.log(`Error en servidor ${error}`));

// Para que el JSON se pase al cliente de forma correcta:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Definicion de los routers P para productos y C para carrito:
app.use('/api/productos', routerP);
app.use('/api/carrito', routerC);

// Definimos carpeta de archivos estáticos:
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

app.get('/',(require,response)=>{
    response.sendFile(__dirname + '/public/index.html');
})

routerP.get('/',(require,response)=>{
    let array = contenedor.getAll();
    console.log('Todos los productos disponibles:\n',array);
    response.json(array);
})

routerP.get('/:id',(require,response)=>{
    let objeto = contenedor.getById(parseInt(require.params.id));
    console.log(objeto);
    response.json(objeto);
})

routerP.post('/',(require,response)=>{
    let agregar = require.body;
    console.log('Producto a agregar:\n',agregar);
    let newId = contenedor.save(agregar);
    response.send(`Id del producto agregado:${newId.toString()}`);
})

routerP.put('/:id',(require,response)=>{
    let id = parseInt(require.params.id);
    let actualizar = require.body;
    let newObject = contenedor.updateById(id,actualizar);
    console.log('Objeto actualizado:\n',newObject);
    response.json({'Objeto actualizado': newObject});
})

routerP.delete('/:id',(require,response)=>{
    let id = parseInt(require.params.id);
    let str = contenedor.deleteById(id);
    response.json(str);
})