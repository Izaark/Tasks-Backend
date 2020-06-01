const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const proyectController = require("../controllers/proyectController");
const auth = require("../middleware/auth");
router.post(
  "/",
  [check("name", "El nombre es obligatorio").not().isEmpty()],
  auth,
  proyectController.createProyect
);

router.get("/", auth, proyectController.getProyect);

router.put(
  "/:id",
  [check("name", "El nombre es obligatorio").not().isEmpty()],
  auth,
  proyectController.updateProyect
);

router.delete("/:id", auth, proyectController.deleteProyect);

module.exports = router;
