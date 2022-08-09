const myLogs = require('../utils/logsGenerator');
const usersMongo = require('../mongo/daos/UsuariosDaoMongo');
const communication = require('../utils/communication');

function error404 (require, response){
    let ruta = require.path;
    let metodo = require.method;
    let notFound = 404;
    response.status(notFound).send({ERROR: notFound, description: `la ruta ${ruta} con método ${metodo} no tiene ninguna función implementada`});
}

function getRoot (req, res){
    myLogs.showInfo(req.path, req.method);
    res.render('pages/index');
}

function getMain (req, res){
    myLogs.showInfo(req.path, req.method)
    res.render('pages/home',{});
}

function postLogin (req, res){
    myLogs.showInfo(req.path, req.method)
    if (req.isAuthenticated()) {
        res.cookie('email', req.user.id).cookie('alias', req.user.alias).redirect('/home');
    }
}

function getFailLogin (req, res){
    myLogs.showInfo(req.path, req.method)
    res.cookie('initErr', true, { maxAge: 1000 }).redirect('/')
}

function postSignup (req, res){
    myLogs.showInfo(req.path, req.method)
    if (req.isAuthenticated()) {
        res.cookie('email', req.user.id).cookie('alias', req.body.alias).redirect('/register/addAvatar');
    } else {
        myLogs.showError('Falló la authenticación')
    }
}

function getFailSignup (req, res){
    myLogs.showInfo(req.path, req.method)
    res.cookie('registerErr', true, { maxAge: 1000 }).redirect('/')
}

function getRegister (req, res){
    myLogs.showInfo(req.path, req.method);
    res.render('pages/register');
}

function postAddAvatar (req, res){
    myLogs.showInfo(req.path, req.method);
    res.render('pages/end-signup');
}

function getCart (req, res) {
    myLogs.showInfo(req.path, req.method);
    res.render('pages/cart');
}

async function uploadAvatar (req, res, next, transporter, client) {
    
    // verificación de file
    const file = req.file;
    if(!file) {
        const error = new Error('please upload a file');
        error.httpStatusCode = 400;
        myLogs.showError(error);
        return next(error);
    }

    // para la comunicación con apis nodemailer y twilio
    let user = await usersMongo.readUser(req.user.id);
    communication.welcomeMail(transporter, user); // enviar mail al usuario
    communication.newUserMail(transporter, user); // enviar mail al administrador
    communication.newUserWhatsApp(client, user); // enviar WhatsApp al administrador

    res.redirect('/home');
}

function getProfile (req, res) {
    myLogs.showInfo(req.path, req.method);
    res.render('pages/myProfile');
}

module.exports = {
    error404,
    getRoot,
    getMain,
    postLogin,
    getFailLogin,
    postSignup,
    getFailSignup,
    getRegister,
    postAddAvatar,
    uploadAvatar,
    getCart,
    getProfile
}