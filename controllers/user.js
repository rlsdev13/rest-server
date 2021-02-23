const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    var { limite = 5, desde = 0} = req.query;
    const query = { estado : true };

    if(isNaN(limite) || isNaN(desde)){//validación del req.query
        limite = 5;
        desde = 0;
    }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({ 
        total,
        usuarios
    });//se manda como un objeto 
}

const usuariosPost = async (req, res = response) => {
    const {nombre, correo, password, role} = req.body;//destructuracion de body
    const usuario = new Usuario({nombre, correo, password, role});

    //encriptar la contra
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    //guardar en BD
    await usuario.save();

    res.json( usuario );
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params; 
    const {_id, password, google, correo, ...resto } = req.body;

    //Validar contra de BD
    if ( password ) {
        //encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json( usuario );
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg : "patch API - controlador"
    });
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params; 

    const usuario = await Usuario.findByIdAndUpdate( id, {estado : false} );

    res.json({
        msg : "delete API - controlador",
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}