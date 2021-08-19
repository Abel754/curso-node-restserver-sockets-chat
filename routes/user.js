
const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const {validarCampos} = require('../middlewares/validar-campos');
const {usuariosGet, usuariosPost, usuariosPatch, usuariosPut, usuariosDelete} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos // Es posarà sempre amb un check
], usuariosPut); // Els dos punts : significa que espera un paràmetre per la URL
// check és propi d'express-validator
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('password', 'El password es obligatorio y debe ser de más de 6 letras').isLength({min: 6}), 
    check('correo').custom(emailExiste),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRolValido),
    validarCampos   
], usuariosPost); // El segon paràmetre (array) sempre és el middleware

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;