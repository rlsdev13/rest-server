const { response } = require('express')
const { Producto } = require('../models');


const getProducto = async ( req, res = response ) => {
    const { limite = 5, desde = 0} =req.query;
    const query = { estado : true };

    if ( isNaN(limite) || isNaN(desde)) {
        limite = 5;
        desde = 0;
    }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate('usuario','nombre')
                .populate('categoria','nombre')
                .skip(Number(desde))
                .limit(Number(limite))
    ]);

    return res.json({
        total,
        productos
    })

}

const getProductoById = async ( req, res = response ) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
                                    .populate('categoria', 'nombre')
                                    .populate('usuario','nombre');

    return res.json( producto );

}

const postProducto = async ( req, res = response ) => {
    const { nombre, precio, categoria, descripcion} = req.body;

    try {

        const existeProductoDB = await Producto.findOne({ nombre });

        if ( existeProductoDB ){
            return res.status(400).json({
                msg : `El producto ${nombre} ya existe`
            });
        }

        console.log("pasando!!");
        const data = {
            nombre,
            usuario : req.usuarioAutenticado,
            precio,
            categoria,//verificar la categoria en el midd
            descripcion
        }
    
        const producto = new Producto( data );
    
        await producto.save();

        res.status(201).json( producto );
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Contacte con el admin"
        });
    }
}

const putProducto = async ( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    try {
        data.usuario = req.usuarioAutenticado;
        const producto = await Producto.findByIdAndUpdate( id , data ,{ new : true })
                                        .populate('usuario','nombre')
                                        .populate('categoria','nombre');
        
        return res.json( producto );                                        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Contacte con el Administrador"
        });
    }

}

const deleteProducto = async ( req, res = response ) => {
    const { id } = req.params;
    
    const data = {
        estado : false,
        usuario : req.usuarioAutenticado
    }

    const producto = await Producto.findByIdAndUpdate( id , data, { new : true} );
    
    return res.json( producto );
}

module.exports = {
    getProducto,
    getProductoById,
    postProducto,
    putProducto,
    deleteProducto
}