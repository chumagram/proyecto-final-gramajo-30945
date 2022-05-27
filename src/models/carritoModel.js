const mongoose = require('mongoose');

const containerCollection = 'carritos';

const ContainerSchema = new mongoose.Schema ({
    ourId: {type: Number, require: true},
    listP: {type: Object}
},{versionKey: false, timestamps: true});

module.exports = mongoose.model(containerCollection, ContainerSchema);