const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const {validatePass} = require('./passValidator')
const {createHash} = require('./hashGenerator')

const usersMongo = require('../mongo/daos/UsuariosDaoMongo')

function authUser(){
    
    // Registrar la ruta login en passport
    passport.use('login', new LocalStrategy(
        async (username, password, callback) => {
            let user = await usersMongo.readUser(username)
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

    // Registrar la ruta signup en passport
    passport.use('signup', new LocalStrategy(
        // le digo que quiero recibir el req y que se pase como parametro
        {passReqToCallback: true}, async (req, username, password, callback) => {
            const newUser = {
                id: username,
                password: createHash(password),
                name: req.body.name,
                lastname: req.body.lastname,
                age: req.body.age,
                phone: req.body.phone,
                alias: req.body.alias,
                address: req.body.address,
                cartId: 0
            }
            let userStatus = await usersMongo.addUser(newUser);

            if (userStatus.found){
                return callback(null, false)
            } else {
                return callback(null, newUser)
            }
        }
    ))

    

    // passport necesita serializar...
    passport.serializeUser((user, callback) => {
        callback(null, user.id) // se pasa id porque es único en la DB
    })
    passport.deserializeUser(async (id, callback) => {
        let user = await usersMongo.readUser(id); // se busca en la DB por id
        callback (null, user)
    })
}

module.exports = {authUser}