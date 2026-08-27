// =================================================================
// MODELO: Producto (POO)
// Encapsula todo el acceso a datos de la tabla `productos`
// =================================================================
const pool = require("./db");

class Producto {
    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.imagen_url,
                    p.disponible, c.id_categoria, c.nombre_categoria AS categoria
             FROM productos p
             INNER JOIN categorias c ON p.id_categoria = c.id_categoria
             ORDER BY c.id_categoria, p.id_producto`
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            `SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.imagen_url,
                    p.disponible, c.id_categoria, c.nombre_categoria AS categoria
             FROM productos p
             INNER JOIN categorias c ON p.id_categoria = c.id_categoria
             WHERE p.id_producto = ?`,
            [id]
        );
        return filas[0];
    }

    static async crear({ nombre, descripcion, precio, idCategoria, imagenUrl, disponible }) {
        const [resultado] = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, id_categoria, imagen_url, disponible)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio, idCategoria, imagenUrl, disponible ?? 1]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, descripcion, precio, idCategoria, imagenUrl, disponible }) {
        const [resultado] = await pool.query(
            `UPDATE productos
             SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, imagen_url = ?, disponible = ?
             WHERE id_producto = ?`,
            [nombre, descripcion, precio, idCategoria, imagenUrl, disponible, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            `DELETE FROM productos WHERE id_producto = ?`,
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Producto;
