const Role = require('../models/role');
const Usuario = require('../models/usuario');

const isRoleValid = async(role = '') => {
    const existRole = await Role.findOne({ role });

    if(!existRole){
        throw new Error('Rol no válido en BD');
    }
}

const emailExist = async (correo = '') => {
    const emailExist = await Usuario.findOne({correo});

    if ( emailExist ) {
        throw new Error(`El correo : ${correo} ya esta registrado!!`);
    }
}

const idExist = async ( id = '' )=> {
    const idExist = await Usuario.findById( id );

    if ( !idExist ){
        throw new Error(`El id: ${id} no existe`);
    }

}

module.exports = {
    isRoleValid,
    emailExist,
    idExist
}