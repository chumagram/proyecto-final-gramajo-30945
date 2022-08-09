
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
const {socketHome} = require('./src/routes/socketHome')
const {socketCart} = require('./src/routes/socketCart')

// Api's de comunicación
const nodemailer = require('nodemailer')
const accountSid = process.env.SID_TWILIO; 
const authToken = process.env.AUTH_TOKEN_TWILIO; 
const client = require('twilio')(accountSid, authToken)

// para modo CLUSTER
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const myLogs = require('./src/utils/logsGenerator');


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

// Configurar Nodemailer - Objeto transportador
const transporter = nodemailer.createTransport({
    //host: 'smtp.ethereal.email',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


//* * * * * * * * * * * * *    Rutas    * * * * * * * * * * * * *

// Definimos la ruta que va a ser cada variable route:
app.use('/api/producto', productRoutes);
app.use('/api/carrito', cartRoutes);

// Funciones de autenticación del usuario
authUser();

// Login
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), serverRoutes.postLogin)
app.get('/faillogin', serverRoutes.getFailLogin)

// Raíz
app.get('/', serverRoutes.getRoot);

// Página principal
app.get('/home', serverRoutes.getMain);

// Página para carrito
app.get('/cart', serverRoutes.getCart);

// Signup
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup' }), serverRoutes.postSignup);
app.get('/failsignup', serverRoutes.getFailSignup);
// Cargar formulario para que el usuario se registre
app.get('/register', serverRoutes.getRegister);
// Añadir avatar del usuario
app.get('/register/addAvatar', serverRoutes.postAddAvatar);
// Guardar avatar del usuario y enviar mails y mensajes
app.post('/uploadfile', upload.single('avatar'), (req, res, next) => {
    serverRoutes.uploadAvatar(req, res, next, transporter, client);
});

// Página para perfil
app.get('/myProfile', serverRoutes.getProfile);

// Socket
io.on('connection', socket => {
    socketHome (socket, io)
    socketCart (socket, io, transporter, client)
});

// Error 404 - Page Not Found
app.get('*', serverRoutes.error404);

//* * * * * * * *  Levantar el servidor según variable de entorno  * * * * * * * *

if( process.env.MODE == 'CLUSTER' ){

    if(cluster.isPrimary) { // isPrimary | isMaster
        myLogs.logInfoAviso(`Primary PID ${process.pid}`);
        for (let index = 0; index < numCPUs; index++){
            cluster.fork(PORT);
        }
        cluster.on('online', worker =>{
            myLogs.logInfoAviso(`Worker PID ${worker.process.pid} online`);
        })
        cluster.on('exit', worker => {
            myLogs.logInfoAviso(`Worker PID ${worker.process.pid} died`);
        })
    
    } else { // entra al else cuando es un worker
        httpServer.listen(PORT, () => {
            myLogs.logInfoAviso("Server HTTP escuchando en el puerto " + httpServer.address().port);
        });
    } 

} else {

    httpServer.listen(PORT, () => {
        myLogs.logInfoAviso("Server HTTP escuchando en el puerto " + httpServer.address().port)
    });
}