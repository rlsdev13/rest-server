const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole, esAdminRole } = require('../middlewares');
const { existeCategoriaId, existeProductobyId } = require('../helpers');

const {
    getProducto,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto
} = require('../controllers');

const router = Router();
/**
 * {{url}}/api/productos
*/

router.get('/',getProducto);

router.get('/:id',[
    check('id','El formato del id no es valido').isMongoId(),
    check('id').custom( existeProductobyId ),
    validarCampos
],getProductoById);

router.post('/',[
    validarJWT,
    tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),
    check('nombre','El nombre es obligatorio').notEmpty().toUpperCase(),
    check('precio','El precio debe ser numerico').optional().isNumeric(),
    check('categoria','El formato del id es invalido').isMongoId(),
    check('categoria').custom( existeCategoriaId ),
    validarCampos,
],postProducto);

router.put('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),
    check('id','El formato del id no es valido').isMongoId(),
    check('id').custom( existeProductobyId ),
    check('nombre').optional().toUpperCase(),
    check('precio').optional().isNumeric(),
    check('categoria','El formato del ID categoria no es valido').optional().isMongoId(),
    check('categoria').optional().custom( existeCategoriaId ),
    check('descripcion').optional(),
    check('disponible').optional().isBoolean(),
    validarCampos
],putProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El formato del ID no es valido').isMongoId(),
    check('id').custom( existeProductobyId ),
    validarCampos
],deleteProducto);

module.exports = router;