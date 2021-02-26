const { response } = require('express')
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const { googleVirify } = require('../helpers/google-verify');


const login = async ( req, res = response )=> {
    const { correo, password } = req.body;

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg : "Usuario o contraseña incorrectos - correo"
            });
        }

        //El usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg : "Usuario o contraseña incorrectos- estado: false"
            });
        }
        //verificar la contraseña
        const validarPassword = bcryptjs.compareSync( password,usuario.password );

        if ( !validarPassword ) {
            return res.status(400).json({
                msg : "Usuario o contraseña incorrectos - password"
            });
        }        

        //generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Hable con el admin"
        });
    }

}

const googleSignIn = async (req, res = response) =>{
    const {id_token} = req.body;

    try {
        const { nombre, correo, img } = await googleVirify(id_token);
        
        //Buscar el usuario en la BD
        let usuario = await Usuario.findOne({ correo });

        //crear usuario si este no existe
        if( !usuario ){            
            const data = {
                nombre,
                correo,
                password : 'XD',
                img,
                google : true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB estado: false
        if( !usuario.estado ) {
            return res.status(401).json({
                msg : 'Hable con el admin, usuario bloqueado'
            });
        }

        const token = await generarJWT( usuario.id );
    
        res.json({
            msg : "Google SignIn OK!!!",
            usuario,
            token
        });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg : 'Token de Google invalido'
        });        
    }
    
}

module.exports = {
    login,
    googleSignIn
}