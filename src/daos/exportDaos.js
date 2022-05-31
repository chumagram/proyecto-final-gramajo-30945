const dbType = require('../../server');

if (dbType == 'mongoDb') {
    const productos = require('./productos/ProductosDaoMongoDb');
    const carritos = require('./carritos/CarritosDaoMongoDb');
    module.exports = {productos,carritos};
} else if (dbType == 'firebase'){
    const productos = require('./productos/ProductosDaoFirebase');
    const carritos = require('./carritos/CarritosDaoFirebase');
    module.exports = {productos,carritos};
} else if (dbType == 'JSONfiles'){
    const productos = require('./productos/ProductosDaoArchivo');
    const carritos = require('./carritos/CarritosDaoArchivo');
    module.exports = {productos,carritos};
} else {
    const productos = { error: 'falló la selección de la base de datos' };
    const carritos = { error: 'falló la selección de la base de datos' };
    module.exports = {productos,carritos};
}