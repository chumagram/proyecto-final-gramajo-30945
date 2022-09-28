const mongoose = require('mongoose');

const usuariosCollection = 'usuarios';

const UsuariosSchema = new mongoose.Schema ({
    email: {type: String, require: true},
    password: {type: String, require: true, max: 20},
    name: {type: String, require: true, max: 20},
    lastname: {type: String, require: true, max: 20},
    age: {type: Number, require: true, max: 100},
    address: {type: String, require: true, max:100},
    alias: {type: String, require: true},
    cartId: {type: Number, require: true}
},{versionKey: false, timestamps: true});

module.exports = mongoose.model(usuariosCollection, UsuariosSchema);