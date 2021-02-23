const { Router } = require('express');
const { check } = require('express-validator');

const { isRoleValid, emailExist, idExist } = require('../helpers/db-validators');

//const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
//const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')

const { 
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/user'); //estamos pasando la referencia del metodo

const router = Router();

router.get('/', usuariosGet);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({ min : 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExist ),
    check('role').custom( isRoleValid ),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),    
    validarCampos    
], usuariosPost);

router.put('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( idExist ),
    check('role').custom( isRoleValid ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom( idExist ),
    validarCampos
], usuariosDelete);



module.exports = router;