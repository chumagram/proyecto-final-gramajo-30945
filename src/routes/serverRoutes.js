const myLogs = require('../utils/logsGenerator');

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
        res.cookie('alias', req.body.alias).redirect('/register/addAvatar');
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

function uploadAvatar (req, res, next) {
    const file = req.file;
    if(!file) {
        const error = new Error('please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.redirect('/home');
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
}