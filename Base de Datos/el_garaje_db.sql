-- =================================================================
-- BASE DE DATOS: EL GARAJE
-- Sistema de gestion de restaurante (usuarios y productos)
-- Motor: MySQL 8.x / MySQL Workbench
-- =================================================================

DROP DATABASE IF EXISTS el_garaje_db;
CREATE DATABASE el_garaje_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE el_garaje_db;

-- =================================================================
-- TABLA: roles
-- Catalogo de roles del personal (admin, cocina, mesero)
-- =================================================================
CREATE TABLE roles (
    id_rol      INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol  VARCHAR(30) NOT NULL UNIQUE
);

-- =================================================================
-- TABLA: usuarios
-- Personal del restaurante con acceso al sistema. id_rol es llave
-- foranea hacia roles (relacion 1 a N: un rol tiene muchos usuarios)
-- =================================================================
CREATE TABLE usuarios (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    correo          VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    id_rol          INT NOT NULL,
    estado          TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_rol
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =================================================================
-- TABLA: categorias
-- Catalogo de categorias del menu
-- =================================================================
CREATE TABLE categorias (
    id_categoria     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(80) NOT NULL UNIQUE
);

-- =================================================================
-- TABLA: productos
-- Platos y bebidas del menu. id_categoria es llave foranea hacia
-- categorias (relacion 1 a N: una categoria tiene muchos productos)
-- =================================================================
CREATE TABLE productos (
    id_producto     INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL,
    descripcion     VARCHAR(255),
    precio          DECIMAL(10,2) NOT NULL,
    id_categoria    INT NOT NULL,
    imagen_url      VARCHAR(500),
    disponible      TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =================================================================
-- DATOS DE PRUEBA: roles
-- =================================================================
INSERT INTO roles (nombre_rol) VALUES
    ('admin'),
    ('cocina'),
    ('mesero');

-- =================================================================
-- DATOS DE PRUEBA: usuarios
-- Contrasenas encriptadas con bcrypt (10 rondas).
-- Contrasena en texto plano de cada credencial de prueba:
--   admin@elgaraje.com   -> Garaje2026*
--   cocina@elgaraje.com  -> Cocina2026*
--   mesero@elgaraje.com  -> Mesero2026*
-- =================================================================
INSERT INTO usuarios (nombre, correo, password, id_rol) VALUES
    ('Administrador General', 'admin@elgaraje.com',  '$2b$10$yOmN33b4TC1qAVpT5Lwla.Ny0s..jOJeuNh3fvFhMfqhFXIVEw5KC', (SELECT id_rol FROM roles WHERE nombre_rol = 'admin')),
    ('Jefe de Cocina',        'cocina@elgaraje.com',  '$2b$10$RhZSyXdiR9J61e2dQeK7I.npMWJg0KhfOtD.elbXE.w.v/92iMOju', (SELECT id_rol FROM roles WHERE nombre_rol = 'cocina')),
    ('Mesero Principal',      'mesero@elgaraje.com',  '$2b$10$RWOq/wPZi9nz3ktR0OqtWOex9OL1FFZEeNJAYEaoVQg/COnFVeJNG', (SELECT id_rol FROM roles WHERE nombre_rol = 'mesero'));

-- =================================================================
-- DATOS DE PRUEBA: categorias
-- =================================================================
INSERT INTO categorias (nombre_categoria) VALUES
    ('Platos Casuales'),
    ('Desgranados'),
    ('Clasicos Urbanos'),
    ('Bebidas');

-- =================================================================
-- DATOS DE PRUEBA: productos (menu real de "El Garaje")
-- =================================================================
INSERT INTO productos (nombre, descripcion, precio, id_categoria, imagen_url) VALUES
    ('Pechuga Ranchera Gratinada', 'Pollo, doble crema, salchicha, tocino, maiz y papa francesa.', 17900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Platos Casuales'), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3OXd7LX8H7LrXRf3CX-x7OQ1DVa9LTRKRMtQd-6PH6--O9raxpz530Lk&s=10'),
    ('Lomo Saltado Callejero', 'Lomo picado, cebolla, tomate, salsa de soya, arroz y papas.', 18500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Platos Casuales'), 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'),
    ('Bife Express con Maduro', 'Filete de res, arroz blanco, papa francesa y platano maduro.', 16900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Platos Casuales'), 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80'),
    ('Pechuga BBQ Crispy', 'Pechuga apanada base, salsa BBQ y papas a la francesa.', 15900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Platos Casuales'), 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80'),
    ('Super Desgranado de la Casa', 'Maiz, pollo, res en cubos, ripio, queso costeno y salsas.', 14500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Desgranados'), 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=400&q=80'),
    ('Chimichangas de Pollo y Queso', 'Tortillas de trigo, pollo desmechado, doble crema y guacamole.', 12900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Desgranados'), 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80'),
    ('Burrito Tex-Mex de Res', 'Tortilla grande, carne molida, arroz, frijol, maiz y queso.', 14900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Desgranados'), 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80'),
    ('Hamburguesa Especial con Tocino', 'Pan, carne 100g, doble crema, tocino, vegetales y papas.', 15500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Clasicos Urbanos'), 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'),
    ('Hamburguesa La Criolla', 'Carne 100g, doble crema, platano maduro frito y papas.', 14900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Clasicos Urbanos'), 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80'),
    ('Perro Suizo Gratinado', 'Pan de perro, salchicha suiza, doble crema fundida y ripio.', 13500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Clasicos Urbanos'), 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=400&q=80'),
    ('Salchipapa Especial El Garaje', 'Papas, salchicha manguera, pollo en cubos, queso y maiz.', 15900, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Clasicos Urbanos'), 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80'),
    ('Limonada de Coco Natural', 'Limon, crema de coco, leche, azucar y hielo frappe.', 7500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas'), 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80'),
    ('Jugo Natural en Agua', 'Pulpa de fruta natural en agua con toque de azucar.', 4500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas'), 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80'),
    ('Limonada Cerezada Natural', 'Limon, cerezas, jarabe especial y hielo.', 6500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas'), 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80'),
    ('Gaseosa 350ml', 'Postobon o Coca-Cola en presentacion personal.', 3500, (SELECT id_categoria FROM categorias WHERE nombre_categoria = 'Bebidas'), 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80');
