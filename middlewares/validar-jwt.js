const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token')

    if ( !token ) {
        return res.status(401).json({
            msg:"No tienes permiso - no hay token en la petición"
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al usuario
        const usuarioAutenticado = await Usuario.findById( uid );

        //validar si el usuario esta registrado en la BD
        if( !usuarioAutenticado ){
            return res.status(401).json({
                msg : "El usuario no esta registrado"
            })
        }

        //Validar si el usuario tiene "estado : true"
        if( !usuarioAutenticado.estado ){
            return res.status(401).json({
                msg : "El usuario no esta registrado -estado:false"
            })
           
        }
        
        req.usuarioAutenticado = usuarioAutenticado;

        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            msg : "Token no valido"
        });
    }

    

    
}

module.exports = {
    validarJWT
}