const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            productos: '/api/productos',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads',
        }

        // Conectar BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS npm i cors (una llibreria de middleware)
        this.app.use(cors());

        // Parseo y lectura del body
        this.app.use(express.json()); // Qualsevol informació que vingui a la ruta, l'agafarà i la passarà a JSON

        // Directorio público
        this.app.use(express.static('public')); // Use és específic de middlewares

        // Fileupload - Carga de archivos (npm i express-fileupload)
        // Note that this option available for versions 1.0.0 and newer. 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // Si mous un fitxer a un directori i no existeix, el crearà
        }));

    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/user'));     
        this.app.use(this.paths.uploads, require('../routes/uploads'));     

    }

    sockets() {

        this.io.on("connection", ( socket ) => socketController(socket, this.io))

    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto' , this.port);
        })
    }

}


module.exports = Server;