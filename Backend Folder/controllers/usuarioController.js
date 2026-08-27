// =================================================================
// CONTROLADOR: Usuario
// Logica de negocio: login con validacion de credenciales y CRUD
// =================================================================
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

class UsuarioController {
    // POST /api/usuarios/login
    static async login(req, res) {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios." });
            }

            const usuario = await Usuario.obtenerPorCorreo(correo);
            if (!usuario) {
                return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
            }

            if (usuario.estado === 0) {
                return res.status(403).json({ mensaje: "Este usuario se encuentra inactivo." });
            }

            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({ mensaje: "Correo o contraseña incorrectos." });
            }

            return res.json({
                mensaje: "Acceso autorizado.",
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error interno al iniciar sesión." });
        }
    }

    // GET /api/usuarios
    static async listar(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            return res.json(usuarios);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener los usuarios." });
        }
    }

    // GET /api/usuarios/:id
    static async obtener(req, res) {
        try {
            const usuario = await Usuario.obtenerPorId(req.params.id);
            if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado." });
            return res.json(usuario);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al obtener el usuario." });
        }
    }

    // POST /api/usuarios
    static async crear(req, res) {
        try {
            const { nombre, correo, password, rol } = req.body;

            if (!nombre || !correo || !password || !rol) {
                return res.status(400).json({ mensaje: "Todos los campos son obligatorios (nombre, correo, password, rol)." });
            }

            const idRol = await Usuario.obtenerIdRolPorNombre(rol);
            if (!idRol) {
                return res.status(400).json({ mensaje: "Rol inválido. Use admin, cocina o mesero." });
            }

            const existente = await Usuario.obtenerPorCorreo(correo);
            if (existente) {
                return res.status(409).json({ mensaje: "Ya existe un usuario registrado con ese correo." });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const idUsuario = await Usuario.crear({ nombre, correo, passwordHash, idRol });

            return res.status(201).json({ mensaje: "Usuario creado con éxito.", id: idUsuario });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al crear el usuario." });
        }
    }

    // PUT /api/usuarios/:id
    static async actualizar(req, res) {
        try {
            const { nombre, correo, rol, estado } = req.body;

            const idRol = await Usuario.obtenerIdRolPorNombre(rol);
            if (!idRol) {
                return res.status(400).json({ mensaje: "Rol inválido. Use admin, cocina o mesero." });
            }

            const filasAfectadas = await Usuario.actualizar(req.params.id, {
                nombre,
                correo,
                idRol,
                estado: estado ?? 1
            });

            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado." });
            }

            return res.json({ mensaje: "Usuario actualizado con éxito." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al actualizar el usuario." });
        }
    }

    // DELETE /api/usuarios/:id
    static async eliminar(req, res) {
        try {
            const filasAfectadas = await Usuario.eliminar(req.params.id);
            if (filasAfectadas === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado." });
            }
            return res.json({ mensaje: "Usuario eliminado con éxito." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: "Error al eliminar el usuario." });
        }
    }
}

module.exports = UsuarioController;
