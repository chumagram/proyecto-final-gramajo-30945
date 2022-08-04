const express = require('express');
const path = require('path');

let directorioJson = path.join(__dirname,"../data/usuarios.json");
const {Router} = express;
const productRoute = Router();
let admin;

// DEVOLVER TODOS LOS PRODUCTOS
productRoute.get('/', async (require,response)=>{
    await productos.readAllProducts().then((res) => {
        console.log(res);
        response.send(res);
    });
})

// DEVOLVER UN PRODUCTO SEGUN SU ID
productRoute.get('/:id', async (require,response)=>{
    await productos.readProduct(parseInt(require.params.id)).then((res) => {
        console.log(res);
        response.send(res);
    });
})

// AGREGAR UN NUEVO PRODUCTO (ADMIN)
productRoute.post('/', async (require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        let agregar = require.body;
        await productos.createProduct(agregar).then((res) => {
            console.log(res);
            response.send(res);
        });
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

//ACTUALIZAR UN PRODUCTO SEGUN SU ID (ADMIN)
productRoute.put('/:id', async (require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        let id = parseInt(require.params.id);
        let actualizar = require.body;
        await productos.updateProduct(id,actualizar).then((res) => {
            console.log(res);
            response.send(res);
        });
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

// ELIMINAR UN PRODUCTO SEGUN SU ID (ADMIN)
productRoute.delete('/:id', async (require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if(admin.adminState){
        let id = parseInt(require.params.id);
        await productos.deleteProduct(id).then((res) => {
            console.log(res);
            response.send(res);
        });
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

// ELIMINAR TODA LA LISTA DE PRODUCTOS (ADMIN)
productRoute.delete('/', async (require,response)=>{
    admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));
    if (admin.adminState){
        await productos.deleteAllProducts().then((res) => {
            console.log(res);
            response.send(res);
        });
    } else {
        response.send(`Admin:${admin.adminState} -> Usted no es un administrador`);
    }
})

module.exports = productRoute;