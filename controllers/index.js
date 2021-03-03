const auth = require('./auth');
const buscar = require('./buscar');
const categorias = require('./categorias');
const productos = require('./productos');
const user = require('./user');


module.exports = {
    ...auth,
    ...buscar,
    ...categorias,
    ...productos,
    ...user
}