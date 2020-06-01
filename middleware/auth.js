const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    // check if token is on headers
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No hay Token, permiso denegado'})
    }
    // check if token es validated
    try {
        const cipher = jwt.verify(token, process.env.SECRET)
        req.user = cipher.user
        next()

    } catch (error) {
        res.status(401).json({msg: 'Token no valido'})
    }
}