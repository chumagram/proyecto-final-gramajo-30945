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

// Llamada a la ruta raíz
app.get('/',(require,response)=>{
    response.sendFile(__dirname + '/public/index.html');
})

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