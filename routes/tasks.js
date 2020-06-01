const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("proyect", "El id del proyecto es inocrrecto").isMongoId(),
  ],
  auth,
  taskController.createTask
);

router.get("/", auth, taskController.getTasks);

router.put(
  "/:id",
  [check("proyect", "El id del proyecto es inocrrecto").isMongoId()],
  auth,
  taskController.updateTask
);

router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
