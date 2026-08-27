// =================================================================
// RUTAS: /api/productos
// =================================================================
const express = require("express");
const router = express.Router();
const ProductoController = require("../controllers/productoController");

router.get("/", ProductoController.listar);
router.get("/:id", ProductoController.obtener);
router.post("/", ProductoController.crear);
router.put("/:id", ProductoController.actualizar);
router.delete("/:id", ProductoController.eliminar);

module.exports = router;
