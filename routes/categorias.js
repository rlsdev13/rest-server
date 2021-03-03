const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares');
const { existeCategoriaId } = require('../helpers');


const { 
    getCategorias,
    getCategoriasById,
    postCategoria,
    putCategoria,
    deleteCategorias 
} = require('../controllers/categorias');

const router = Router();


/**
 * {{url}}/api/categorias
*/


//Obtener todas las categorias - publico
router.get('/', getCategorias);

//Obtener una categoria por ID - publico
router.get('/:id',[
    check('id','El id no es válido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
], getCategoriasById);

//Crear categoria - privado- cualquier role
router.post('/',[
    validarJWT,
    tieneRole('USER_ROLE','ADMIN_ROLE','VENTAS_ROLE'),
    check('nombre', 'El nombre de la categoria es obligatorio').notEmpty(),
    validarCampos
],postCategoria);

//Actualizar un registro por ID - Privado: cualquier role
router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('id','El id no es valido').isMongoId(),
    check('id').custom( existeCategoriaId ),
    validarCampos
],putCategoria);

//Borrar categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El id de la categoria no es valido').isMongoId(),
    check('id').custom( existeCategoriaId),
    validarCampos
],deleteCategorias);


module.exports = router;