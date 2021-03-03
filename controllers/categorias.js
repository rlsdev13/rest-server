const { response } = require('express');
const { Categoria } = require('../models');

const getCategorias = async ( req, res = response ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado : true };

    if(isNaN(limite) || isNaN(desde)){//validación del req.query
        limite = 5;
        desde = 0;
    }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        categorias
    });
}

const getCategoriasById = async ( req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate('usuario','nombre');

    res.json( categoria );
}

const postCategoria = async ( req, res = response ) => {
    const nombre = req.body.nombre.toUpperCase();

    try {

        const categoriaDB = await Categoria.findOne({ nombre });

        if( categoriaDB ){
            return res.status(400).json({
                msg : `La categoria '${categoriaDB.nombre}' ya existe`
            });
        }

        //generar la data a guardar

        const data ={
            nombre,
            usuario : req.usuarioAutenticado._id
        }

        const categoria = new Categoria( data );

        //Guardar categoria

        await categoria.save();

        return res.status(201).json(categoria);
 
    } catch (error) {
        return res.status(500).json({
            msg : "contacte con el admin"
        })
    }

    
}

const putCategoria = async ( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;

    try {
        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuarioAutenticado;
        const categoria = await Categoria.findByIdAndUpdate( id , data, {new : true})
                                         .populate('usuario','nombre');

        res.json( categoria );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "Contacte con el Administrador"
        });
    }

}

const deleteCategorias = async ( req, res = response ) => {
    const { id } = req.params;

    const data = {
        estado : false,
        usuario : req.usuarioAutenticado
    }

    const categoria = await Categoria.findByIdAndUpdate( id , data, { new : true } );

    res.json( categoria );
}

module.exports = {
    getCategorias,
    getCategoriasById,
    postCategoria,
    putCategoria,
    deleteCategorias
}