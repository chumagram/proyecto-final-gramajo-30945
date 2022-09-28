const mongoose = require('mongoose');

const containerCollection = 'ordenes';

const ContainerSchema = new mongoose.Schema ({
    email: {type: String, require: true},
    name: {type: String, require: true, max: 20},
    lastname: {type: String, require: true, max: 20},
    dirEnvio: {type: String, require: true, max:100},
    numOrden: {type: Number, require: true},
    listP: {type: Object, require: true}
},{versionKey: false, timestamps: true});

module.exports = mongoose.model(containerCollection, ContainerSchema);