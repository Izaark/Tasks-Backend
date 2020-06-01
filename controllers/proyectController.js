const Proyect = require("../documents/Proyect");
const { validationResult } = require("express-validator");

// create proyect
exports.createProyect = async (req, res) => {
  try {
    // check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let proyect = new Proyect(req.body);

    // save owner in proyect from req set in auth
    proyect.owner = req.user.id;

    // save proyect
    proyect.save();
    res.status(201).json({ proyect, msg: "Proyecto creado" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// get proyects
exports.getProyect = async (req, res) => {
  try {
    const proyects = await Proyect.find({ owner: req.user.id }).sort({
      created: -1,
    });
    res.json({proyects, msg: "Proyects success" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

exports.updateProyect = async (req, res) => {
  // check errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  const newProyect = {};

  newProyect.name = name;

  try {
    let proyect = await Proyect.findById(req.params.id);

    // check if exixts
    if (!proyect) {
      return res
        .status(404)
        .json({ msg: "No existe el proyecto", status: 404 });
    }
    // check if is the proyect owner
    if (proyect.owner.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "No tienes permisos para hacer esto", status: 401 });
    }
    // update proyect
    proyect = await Proyect.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProyect },
      { new: true }
    );
    res.json({ data: proyect, msg: "Proyecto actualizado" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

// delete proyect
exports.deleteProyect = async (req, res) => {
  try {
    const pryectId = req.params.id;
    let proyect = await Proyect.findById(pryectId);

    // check if exixts
    if (!proyect) {
      return res
        .status(404)
        .json({ msg: "No existe el proyecto", status: 404 });
    }
    // check if is the proyect owner
    if (proyect.owner.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "No tienes permisos para hacer esto", status: 401 });
    }
    // update proyect
    proyect = await Proyect.findOneAndRemove({ _id: pryectId });
    res.json({ msg: "proyecto eliminado" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
