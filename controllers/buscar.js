const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarUsuarios = async ( termino = '', res = response ) => {
    const esMongoId = ObjectId.isValid( termino );//TRUE||FALSE

    if( esMongoId ){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results : ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i'); 

    const usuarios = await Usuario.find({ 
        $or : [{ nombre : regex }, { correo : regex}],
        $and : [{ estado : true}]
    });
    
    return res.json({
        results : usuarios
    });
}

const buscarCategorias = async ( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );//TRUE||FALSE

    if( esMongoId ){
        const categoria = await Categoria.findById( termino )
                                         .populate('usuario','nombre');
        return res.json({
            results : ( categoria ) ? [ categoria ] : []
        });
    }

    const categorias = await Categoria.findCategorias(termino)
                                      .populate('usuario','nombre') ;//consulta en modelo

    return res.json({
        results : categorias
    });
}

const buscarProductos = async ( termino , res = response) => {
    const regex = new RegExp( termino , 'i' );

    const esMongoId = ObjectId.isValid( termino );//TRUE||FALSE

    if( esMongoId ){
        const producto = await Producto.findById( termino )
                                       .populate('usuario','nombre')
                                       .populate('categoria','nombre');
        return res.json({
            results : ( producto ) ? [ producto ] : []
        });
    }

    if( !isNaN(termino) ){
        const productos = await Producto.find({ 
            precio : termino,
            $and : [ {estado : true} ]
        })
        .populate('usuario','nombre')
        .populate('categoria','nombre');

        return res.json({
            results : productos
        });
    }

    const productos = await Producto.find({
        $or : [{nombre : regex}],
        $and : [{estado : true}]
    })
    .populate('usuario','nombre')
    .populate('categoria','nombre');;

    return res.json({
        results : productos 
    });
}


const getBuscar = ( req , res = response ) => {
    const { collection, termino } = req.params;

    if ( !coleccionesPermitidas.includes(collection) ) {
        return res.status(400).json({
            msg : `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch ( collection ) {
        case coleccionesPermitidas[0]://categoria
            buscarCategorias( termino, res );
        break;
        case coleccionesPermitidas[1]://productos
            buscarProductos( termino, res);
        break;
        case coleccionesPermitidas[2]://roles
            return res.json({
                msg : 'roles'
            });
            
        break;
        case coleccionesPermitidas[3]://usuarios
            buscarUsuarios(termino,res);
        break;
        default:
            return res.status(500).json({
                msg : "Busqueda de coleccion no encontrada"
            });
        break;
    }
}

module.exports  = {
    getBuscar
}