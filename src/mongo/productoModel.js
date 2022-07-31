const mongoose = require('mongoose');

const containerCollection = 'productos';

const ContainerSchema = new mongoose.Schema ({
    ourId: {type: Number, require: true},
    name: {type: String, require: true},
    price: {type: Number, require: true},
    description: {type: String, require: true},
    thumbnail: {type: String, require: true},
    stock: {type: Number, require: true},
    code: {type: Number, require: true}
},{versionKey: false, timestamps: true});

module.exports = mongoose.model(containerCollection, ContainerSchema);