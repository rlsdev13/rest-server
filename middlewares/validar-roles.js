const { response } = require("express");
const role = require("../models/role");

const esAdminRole = (req, res = response, next) => {

    if ( !req.usuarioAutenticado ) {
        return res.status(500).json({
            msg : "No se ha creado 'usuarioAutenticado'"
        });
    }

    const { role, nombre } = req.usuarioAutenticado;
    
    if ( role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg : `${ nombre } no es administrador - Acción denegada`
        });
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if( !req.usuarioAutenticado ) {
            return res.status(500).json({
                msg : "No se ha creado 'usuarioAutenticado'"
            });
        }

        if( !roles.includes(req.usuarioAutenticado.role) ){
            return res.status(401).json({
                msg : `Acceso denegado - El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}