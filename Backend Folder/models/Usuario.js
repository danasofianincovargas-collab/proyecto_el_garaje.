// =================================================================
// MODELO: Usuario (POO)
// Encapsula todo el acceso a datos de la tabla `usuarios`
// =================================================================
const pool = require("./db");

class Usuario {
    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol AS rol, u.estado, u.fecha_creacion
             FROM usuarios u
             INNER JOIN roles r ON u.id_rol = r.id_rol
             ORDER BY u.id_usuario`
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.correo, r.nombre_rol AS rol, u.estado, u.fecha_creacion
             FROM usuarios u
             INNER JOIN roles r ON u.id_rol = r.id_rol
             WHERE u.id_usuario = ?`,
            [id]
        );
        return filas[0];
    }

    static async obtenerPorCorreo(correo) {
        const [filas] = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.correo, u.password, r.id_rol, r.nombre_rol AS rol, u.estado
             FROM usuarios u
             INNER JOIN roles r ON u.id_rol = r.id_rol
             WHERE u.correo = ?`,
            [correo]
        );
        return filas[0];
    }

    static async obtenerIdRolPorNombre(nombreRol) {
        const [filas] = await pool.query(
            `SELECT id_rol FROM roles WHERE nombre_rol = ?`,
            [nombreRol]
        );
        return filas[0] ? filas[0].id_rol : null;
    }

    static async crear({ nombre, correo, passwordHash, idRol }) {
        const [resultado] = await pool.query(
            `INSERT INTO usuarios (nombre, correo, password, id_rol) VALUES (?, ?, ?, ?)`,
            [nombre, correo, passwordHash, idRol]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, correo, idRol, estado }) {
        const [resultado] = await pool.query(
            `UPDATE usuarios SET nombre = ?, correo = ?, id_rol = ?, estado = ? WHERE id_usuario = ?`,
            [nombre, correo, idRol, estado, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            `DELETE FROM usuarios WHERE id_usuario = ?`,
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Usuario;
