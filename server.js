//* * * * * * * * * * * * Importaciones * * * * * * * * * * * * * *

const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config() // para variables de entorno

// Rutas y herramientas
const productRoutes = require('./src/routes/productRoutes.js');
const cartRoutes = require('./src/routes/cartRoutes.js');
const serverRoutes = require ('./src/routes/serverRoutes');
const upload = require('./src/utils/storageImg');

// Inicio de sesión
const MongoStore = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')

// Socket
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const {socketUser} = require('./src/routes/socketUser')

//* * * * * * * * * * *   Configuraciones   * * * * * * * * * * * * *
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Configurar EJS - Embedded JavaScript templating
const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.set('view engine', 'ejs');

// Configurar Sessions
const {authUser} = require('./src/utils/authUser')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
app.use(session({
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: advancedOptions
    }),
    secret: 'chumagram',
    cookie: {
        maxAge: parseInt(process.env.SESSION_TIME),
        httpOnly: false,
        secure: false
    },
    //rolling: true, 
    resave: false, 
    saveUninitialized: false
}))

// Middleware de passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar Socket
const httpServer = new HttpServer(app); 
const io = new IOServer(httpServer);

//* * * * * * * * * * * * *    Rutas    * * * * * * * * * * * * *

// Definimos la ruta que va a ser cada variable route:
app.use('/api/producto', productRoutes);
app.use('/api/carrito', cartRoutes);

// Funciones de autenticación del usuario
authUser();

// Raíz
app.get('/', serverRoutes.getRoot);

// Página principal
app.get('/home', serverRoutes.getMain);

// Login
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), serverRoutes.postLogin)
app.get('/faillogin', serverRoutes.getFailLogin)

// Signup
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), serverRoutes.postSignup);
app.get('/failsignup', serverRoutes.getFailSignup);
// Cargar formulario para que el usuario se registre
app.get('/register', serverRoutes.getRegister);
// Añadir avatar del usuario
app.get('/register/addAvatar', serverRoutes.postAddAvatar);
// Guardar avatar del usuario
app.post('/uploadfile', upload.single('avatar'), serverRoutes.uploadAvatar);

// Error 404 - Page Not Found
app.get('*', serverRoutes.error404);

// Levantar el servidor:
const server = app.listen(PORT,() => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})
server.on("error", error => console.log(`Error en servidor ${error}`));