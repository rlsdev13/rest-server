const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers');
const {validarCampos, validarArchivo} = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/',validarArchivo,cargarArchivo);

router.put('/:collection/:id',[
    validarArchivo,
    check('id','No es un id válido').notEmpty().isMongoId(),
    check('collection').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary/*actualizarImagen*/);

router.get('/:collection/:id',[
    check('id','No es un id válido').notEmpty().isMongoId(),
    check('collection').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
],mostrarImagen);

module.exports = router;