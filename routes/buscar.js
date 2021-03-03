const { Router } = require('express');
const { check } = require('express-validator');

const { getBuscar } = require('../controllers');

const router = Router();

/**
 * {{url}}/api/buscar
 */

router.get('/:collection/:termino',getBuscar);

module.exports = router;