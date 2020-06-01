const User = require('../documents/Users')
const bcryptjs = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {

    // check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // extract email and password
    const {email, password} = req.body; 

    try {
        // if email exists response error
        let user = await User.findOne({email})
        if (user) {
            return res.status(400).json({ msg: 'El usuario existe', status: 400});
        }
        // instance user
        user = new User(req.body);

        // hash password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt)
        
        // save user
        await user.save()

        // create and sign JWT
        const payload = {
            user: {
                id: user.id
            }
        };
        // sign jwt
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600,
        }, (error, token) => {
            if(error) throw error;
            // message ok
            res.json({token})
        });


        // res.status(201).json({ message: 'el usuario se creo correctamente', status: 201});
    } catch (error) {
        console.log(error)
        res.status(400).send('Error')
    }
}