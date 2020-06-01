const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router();
const { check } = require('express-validator')

router.post('/',
[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })

],
userController.createUser
)
module.exports = router;