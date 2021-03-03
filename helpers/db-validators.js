const { Categoria, Role, Usuario, Producto } = require('../models');

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

const existeCategoriaId = async ( id = '' ) => {
    const categoria = await Categoria.findById( id );

    if ( !categoria ) {
        throw new Error(`La categoria con id: ${id} no existe`);
    }
}

const existeProductobyId = async (id = '') => {
    const producto = await Producto.findById( id );

    if( !producto ) {
        throw new Error(`El producto con id ${ id } no existe`);
    }
}

module.exports = {
    isRoleValid,
    emailExist,
    idExist,
    existeCategoriaId,
    existeProductobyId
}