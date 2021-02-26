const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/login',[
    check('correo','El correo no es valido').isEmail(),
    check('password','La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'id_token necesario').notEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;