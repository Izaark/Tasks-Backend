const User = require("../documents/Users");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  // check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    // check if user is registered
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe", status: 400 });
    }
    // check if password is correct
    const correctPass = await bcryptjs.compare(password, user.password);

    if (!correctPass) {
      return res.status(400).json({ msg: "Password Incorrecto", status: 400 });
    }
    // create and sign JWT
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 7200,
      },
      (error, token) => {
        if (error) throw error;
        // message ok
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error);
  }
};

exports.userAuthenticated = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Hubo un error' })
  }
}
