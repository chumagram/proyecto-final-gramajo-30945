const express = require('express');
const productRoutes = require('./src/routes/productRoutes.js');
const cartRoutes = require('./src/routes/cartRoutes.js');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8080;

let directorioJson = path.join(__dirname,'/src/data/usuarios.json');
let admin = JSON.parse(fs.readFileSync(directorioJson, 'utf-8'));

// Levantar el servidor:
const server = app.listen(PORT,()=>{
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})
server.on("error", error => console.log(`Error en servidor ${error}`));

// Para que el JSON se pase al cliente de forma correcta:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Definimos la ruta que va a ser cada variable route:
app.use('/api/producto', productRoutes);
app.use('/api/carrito', cartRoutes);

// Endpoint del inicio de sesion (solo para admin)
app.get('/login',(require,response)=>{
    let login = require.body;
    if(login.password == 123123123 && login.user == "chuma"){
        admin.adminState = true;
        fs.writeFileSync(directorioJson, JSON.stringify(admin,null,2));
        response.json({Hecho:"Sesión iniciada", Admin: admin.adminState});
    } else if (login.password == 123123123){
        response.json({Error:"Usuario incorrecto"});
    } else if (login.user == "chuma"){
        response.json({Hecho:"Usted es un usuario", Admin: admin.adminState});
    }
})

// Fin de sesion como administrador
app.get('/logout',(require,response)=>{
    admin.adminState = false;
    fs.writeFileSync(directorioJson, JSON.stringify(admin,null,2));
    response.json({Hecho:"Sesión terminada"});
})

// ERROR 404 - Page Not Found
function error404 (require, response){
    let ruta = require.path;
    let metodo = require.method;
    let notFound = 404;
    response.status(notFound).send({ERROR: notFound, description: `la ruta ${ruta} con método ${metodo} no tiene ninguna función implementada`});
}
app.get('*', function(require, response){
    error404(require, response);
});
app.post('*', function(require, response){
    error404(require, response);
});
app.put('*', function(require, response){
    error404(require, response);
});
app.delete('*', function(require, response){
    error404(require, response);
});