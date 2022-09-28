//* Importaciones de módulos
const express = require('express');
const path = require('path');
const compression = require('compression');
const passport = require('passport')
const session = require('express-session')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

//* Importaciones de archivos
const RouterProductos = require('./src/route/productos')
const RouterMensajes = require('./src/route/mensajes')
const RouterCarritos = require('./src/route/carritos')
const RouterUsuarios = require('./src/route/usuarios')
const RouterOrdenes = require('./src/route/ordenes')

const ControllerInicio = require('./src/controller/inicio')
const {error404} = require ('./src/controller/errores')
const {initServer} = require('./src/service/initServer')
const configSession = require('./src/config/session')

//* Middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(compression());

//* Configurar EJS
const publicPath = path.resolve(__dirname, "./public");
app.use(express.static(publicPath));
app.set('view engine', 'ejs');

//* Inicializar controladores
const inicio = new ControllerInicio()

//* Configurar session
app.use(session(configSession));
app.use(passport.initialize());
app.use(passport.session());

//* Configurar http server apra socket io
const httpServer = new HttpServer(app); 
const io = new IOServer(httpServer);

//* Inicializar rutas
const routerProductos = new RouterProductos()
const routerMensajes = new RouterMensajes()
const routerCarritos = new RouterCarritos()
const routerUsuarios = new RouterUsuarios()
const routerOrdenes = new RouterOrdenes()

const LocalStrategy = require('passport-local').Strategy
const {validatePass} = require('./src/utils/passValidator')
const {createHash} = require('./src/utils/hashGenerator')
const ServiceUsuarios = require('./src/service/usuarios')
const serviceUsuarios = new ServiceUsuarios ()

passport.use('login', new LocalStrategy (
  async (username, password, callback) => {
    let user = await serviceUsuarios.obtenerUsuario(username)
    if(user.error) {
      return callback(user.error) // fallo de búsqueda
    } else if (user.notFound){
      return callback(null, false) // no se encontró usuario
    } else {
      if(!validatePass(user, password)){
        return callback(null, false) // password incorrecto
      } else {
        return callback(null, user) // devuelve el usuario
      }
    }
  }
));
  
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true}, async (req, username, password, callback) => {
      const newUser = {
        email: username,
      password: createHash(password),
      name: req.body.name,
      lastname: req.body.lastname,
      age: req.body.age,
      alias: req.body.alias,
      address: req.body.address,
      cartId: 0
    }
    let userStatus = await serviceUsuarios.guardarUsuarios(newUser);
    
    if (userStatus.found){
      return callback(null, false)
    } else {
      return callback(null, newUser)
    }
  }
))
  
passport.serializeUser((user, callback) => {
  callback(null, user.email) // se pasa email porque es único en la DB
})

passport.deserializeUser(async (email, callback) => {
  let user = await serviceUsuarios.obtenerUsuario(email);
  callback (null, user)
})

//* Ruters
app.use('/productos', routerProductos.start())
app.use('/chat', routerMensajes.start())
app.use('/carritos', routerCarritos.start())
app.use('/usuarios', routerUsuarios.start())
app.use('/ordenes', routerOrdenes.start())

//* Websocket
io.on('connection', socket => routerMensajes.socketChat(socket, io));

//* Ruta raíz
app.get('/', inicio.getRoot);

//* Ruta para registrarse
app.get('/registrarse', inicio.getRegister);

//* Ruta para ver configuraciones
app.get('/config', inicio.getConfig);

//* Iniciar servidor
initServer(httpServer);

//* Rutas no contempladas
app.get('*', error404);