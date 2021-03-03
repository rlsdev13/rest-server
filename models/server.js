const express = require('express');
const cors = require('cors')

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth :       '/api/auth',
            buscar:      '/api/buscar',
            categorias : '/api/categorias',
            productos :  '/api/productos',
            usuarios :   '/api/usuarios'
        }
       
        //Conexión a BD
        this.conexionDB();

        //middlewares
        this.middlewares();

        //Rutas de la App
        this.routes();
    }

    async conexionDB(){
        await dbConnection();
    }

    middlewares() {
        //Directorio publico
        this.app.use( express.static('public') );

        //Lectura y parseo del body
        this.app.use(express.json());

        //CORS
        this.app.use( cors() );

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server corriendo en:", this.port);
        });
    }

}

module.exports = Server;