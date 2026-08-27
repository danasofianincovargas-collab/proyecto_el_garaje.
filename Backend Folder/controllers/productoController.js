// =================================================================
// CONTROLADOR: Producto
// Logica de negocio: CRUD de los platos y bebidas del menu
// =================================================================
const Producto = require("../models/Producto");

class ProductoController {
    // GET /api/productos
    static async listar(req, res) {
        try {
            const productos = await Producto.obtenerTodos();
            return res.json(productos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener los productos." });
        }
    }

    // GET /api/productos/:id
    static async obtener(req, res) {
        try {
            const producto = await Producto.obtenerPorId(req.params.id);
            if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado." });
            return res.json(producto);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener el producto." });
        }
    }

    // POST /api/productos
    static async crear(req, res) {
        try {
            const { nombre, descripcion, precio, idCategoria, imagenUrl, disponible } = req.body;

            if (!nombre || !precio || !idCategoria) {
                return res.status(400).json({ mensaje: "Nombre, precio y categoría son obligatorios." });
            }

            const idProducto = await Producto.crear({ nombre, descripcion, precio, idCategoria, imagenUrl, disponible });
            return res.status(201).json({ mensaje: "Producto creado con éxito.", id: idProducto });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al crear el producto." });
        }
    }

    // PUT /api/productos/:id
    static async actualizar(req, res) {
        try {
            const { nombre, descripcion, precio, idCategoria, imagenUrl, disponible } = req.body;

            const filasAfectadas = await Producto.actualizar(req.params.id, {
                nombre, descripcion, precio, idCategoria, imagenUrl, disponible
            });

            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado." });
            }

            return res.json({ mensaje: "Producto actualizado con éxito." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al actualizar el producto." });
        }
    }

    // DELETE /api/productos/:id
    static async eliminar(req, res) {
        try {
            const filasAfectadas = await Producto.eliminar(req.params.id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado." });
            }
            return res.json({ mensaje: "Producto eliminado con éxito." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al eliminar el producto." });
        }
    }
}

module.exports = ProductoController;
