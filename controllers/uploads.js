const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');


const cargarArchivo = async ( req , res = response) => {
    try {
        //const nombre = await subirArchivo(req.files,['txt','md'],'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        return res.json({nombre});
        
    } catch (error) {
        return res.status(400).json({
            msg : error
        });
        
    }
}

const actualizarImagen = async ( req, res = response) => {
    const { collection, id } = req.params;

    let modelo;

    switch( collection ){
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe el usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){
                return res.status(400).json({
                    msg : `No existe el producto con id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({
                msg : `Validación no encontrada`
            });
        break;
    }

    //Limpiar imagenes previas

    try {
        if( modelo.img ){
            //Borrar la img del server
            const pathImg = path.join(__dirname, '../uploads', collection, modelo.img );
            if( fs.existsSync( pathImg ) ) {
                fs.unlinkSync( pathImg );
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Error al subir el archivo"
        });
    }

    const nombre = await subirArchivo(req.files, undefined, collection);

    modelo.img = nombre; 
    await modelo.save();

   
    return res.json(modelo);
}

const actualizarImagenCloudinary = async ( req, res = response) => {
    const { collection, id } = req.params;

    let modelo;

    switch( collection ){
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe el usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){
                return res.status(400).json({
                    msg : `No existe el producto con id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({
                msg : `Validación no encontrada`
            });
        break;
    }

    //Limpiar imagenes previas

    try {
        if( modelo.img ){
            //Borrar la img del server
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length -1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Error al subir el archivo"
        });
    }

    try {
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;
        await modelo.save();
    
        return res.json(modelo);

    } catch (error) {
        return res.status(500).json(error);
    }
    

   
}

const mostrarImagen = async ( req, res = response) => {
    const { collection, id } = req.params;

    let modelo;

    switch( collection ){
        case 'usuarios':
            modelo = await Usuario.findById( id );

            if( !modelo ){
                return res.status(400).json({
                    msg : `No existe el usuario con el id ${ id }`
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById( id );

            if ( !modelo ){
                return res.status(400).json({
                    msg : `No existe el producto con id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({
                msg : `Validación no encontrada`
            });
        break;
    }

    //Limpiar imagenes previas

    try {
        if( modelo.img ){
            //Borrar la img del server
            const pathImg = path.join(__dirname, '../uploads', collection, modelo.img );
            if( fs.existsSync( pathImg ) ) {
                return res.sendFile( pathImg);
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : "Error al subir el archivo"
        });
    }

    const pathImg = path.join(__dirname,'../assets/no-image.jpg');

    res.sendFile( pathImg );
}

module.exports = {
    actualizarImagen,
    actualizarImagenCloudinary,
    cargarArchivo,
    mostrarImagen
}