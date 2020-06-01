
const Proyect = require('../documents/Proyect')
const Task = require('../documents/Task')
const { validationResult } = require("express-validator");
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // extract proyect from body
    let { proyect } = req.body;
    try {
        // check if exists proyect
        const exists = await Proyect.findById(proyect);
        if (!exists) {
            return res.status(401).json({ msg: 'Proyecto no encontrado', status: 401 })
        }
        // check if is the proyect owner
        if (exists.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: "No tienes permisos para hacer esto", status: 401 })
        }
        // create task
        const task = new Task(req.body);
        await task.save()
        res.json({task })
    } catch (error) {
        console.error(error)
        res.status(400).json(error)
    }
}

exports.getTasks = async (req, res) => {

    let { proyect } = req.query;
    try {

        if (!proyect) {
            res.status(400).json({ msg: "El proyect id es necesario" })
        }
        // check if exists proyect
        const exists = await Proyect.findById(proyect);
        if (!exists) {
            return res.status(401).json({ msg: 'Proyecto no encontrado', status: 401 })
        }
        // check if is the proyect owner
        if (exists.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: "No tienes permisos para hacer esto", status: 401 })
        }

        // get tasks by proyect
        const tasks = await Task.find({ proyect }).sort({ created: -1})
        res.json({ tasks: tasks })
    } catch (error) {
        console.error(error)
        res.status(400).json(error)
    }

}

exports.updateTask = async (req, res) => {
    try {
        const { proyect, name, status } = req.body;
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: "No existe la tarea" })
        }

        const existsProyect = await Proyect.findById(proyect)
        // check if is the proyect owner
        if (existsProyect.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: "No tienes permisos para hacer esto", status: 401 })
        }
        // create new object with new information
        const newTask = {};
        newTask.name = name;
        newTask.status = status

        task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true })
        res.json({ task })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

// delete proyect
exports.deleteTask = async (req, res) => {
    try {
        const { proyect } = req.query;
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: "No existe la tarea" })
        }

        const existsProyect = await Proyect.findById(proyect)
        // check if is the proyect owner
        if (existsProyect.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: "No tienes permisos para hacer esto", status: 401 })
        }
        // delete task
        await Task.findOneAndRemove({ _id: req.params.id })
        res.send({ msg: "Task eliminated" })

    } catch (error) {
        res.status(400).json({ msg: error })
    }
};
