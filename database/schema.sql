-- Base de datos Tienda Express
-- Servidor: 192.168.1.20:3306

CREATE DATABASE IF NOT EXISTS tiendaexpress;
USE tiendaexpress;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    metodo_pago VARCHAR(50),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS pedido_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Producto A', 'Descripción del producto A', 29.90, 50),
('Producto B', 'Descripción del producto B', 49.90, 30),
('Producto C', 'Descripción del producto C', 19.90, 100);
