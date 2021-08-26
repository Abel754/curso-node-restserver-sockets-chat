
const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const {validarCampos, validarArchivoSubir} = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post( '/', validarArchivoSubir, cargarArchivo ); 

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos']) ),
    mostrarImagen
])

module.exports = router;    