const express = require('express')
const router = express.Router();
const { check } = require('express-validator')
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/',
[
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({ min: 6 })
],
authController.authUser
)

router.get('/',
auth,
authController.userAuthenticated
)
module.exports = router;