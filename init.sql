-- =============================================================================
-- Script de inicialización – API Ecommerce Gym TPO
-- Ejecutar una sola vez contra la base de datos "ecommerce"
-- Hibernate crea las tablas automáticamente con ddl-auto=update;
-- este script solo carga los datos iniciales de prueba.
-- =============================================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

-- =============================================================================
-- USUARIOS
-- Passwords encriptadas con BCrypt (factor 10):
--   admin@gym.com   → password: Admin1234!
--   cliente@gym.com → password: Cliente123!
-- =============================================================================
INSERT INTO usuarios (email, password_hash, rol, fecha_registro, activo)
VALUES
    ('admin@gym.com',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'ADMIN',
     NOW(),
     true),
    ('cliente@gym.com',
     '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FXDt6uGJcum6',
     'CLIENTE',
     NOW(),
     true)
ON DUPLICATE KEY UPDATE email = email;

-- =============================================================================
-- CATEGORÍAS
-- =============================================================================
INSERT INTO categorias (nombre, descripcion)
VALUES
    ('Suplementos',     'Proteínas, creatinas, aminoácidos y más'),
    ('Equipamiento',    'Pesas, barras, mancuernas y accesorios'),
    ('Indumentaria',    'Ropa deportiva y calzado'),
    ('Nutrición',       'Barras energéticas, snacks saludables y bebidas'),
    ('Accesorios',      'Guantes, cinturones, rodilleras y correas')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================================================
-- MARCAS
-- =============================================================================
INSERT INTO marcas (nombre, descripcion)
VALUES
    ('Optimum Nutrition', 'Líder mundial en suplementos deportivos'),
    ('Scitec Nutrition',  'Marca europea de alta calidad'),
    ('Under Armour',      'Indumentaria y calzado deportivo premium'),
    ('Adidas',            'Equipamiento y ropa deportiva global'),
    ('ProFitness',        'Equipamiento de gym para uso intensivo')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================================================
-- PRODUCTOS
-- (id_vendedor = 1 = admin@gym.com)
-- =============================================================================
INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, id_marca, id_vendedor)
VALUES
    ('Gold Standard Whey 2lb',
     'Proteína de suero de alta calidad, 24g de proteína por porción. Sabor chocolate.',
     8500.00, 50,
     (SELECT id FROM categorias WHERE nombre = 'Suplementos'),
     (SELECT id FROM marcas WHERE nombre = 'Optimum Nutrition'),
     1),

    ('Creatina Monohidratada 300g',
     'Creatina pura micronizada para mayor rendimiento y recuperación muscular.',
     4200.00, 80,
     (SELECT id FROM categorias WHERE nombre = 'Suplementos'),
     (SELECT id FROM marcas WHERE nombre = 'Scitec Nutrition'),
     1),

    ('Mancuernas Hexagonales 10kg (par)',
     'Mancuernas de acero recubiertas de goma, antideslizantes. Par 10kg.',
     12500.00, 20,
     (SELECT id FROM categorias WHERE nombre = 'Equipamiento'),
     (SELECT id FROM marcas WHERE nombre = 'ProFitness'),
     1),

    ('Remera Deportiva Dry-Fit',
     'Remera de entrenamiento con tecnología de absorción de humedad. Talle M.',
     3800.00, 100,
     (SELECT id FROM categorias WHERE nombre = 'Indumentaria'),
     (SELECT id FROM marcas WHERE nombre = 'Under Armour'),
     1),

    ('Guantes de Entrenamiento',
     'Guantes con palma de cuero sintético y velcro ajustable. Talle M.',
     2100.00, 60,
     (SELECT id FROM categorias WHERE nombre = 'Accesorios'),
     (SELECT id FROM marcas WHERE nombre = 'Adidas'),
     1),

    ('Barra energética proteica x12',
     'Pack 12 unidades. 20g proteína por barra. Sabores surtidos.',
     3500.00, 40,
     (SELECT id FROM categorias WHERE nombre = 'Nutrición'),
     (SELECT id FROM marcas WHERE nombre = 'Scitec Nutrition'),
     1)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================================================
-- DESCUENTOS
-- =============================================================================
INSERT INTO descuentos (nombre, tipo, valor, fecha_inicio, fecha_fin, activo)
VALUES
    ('Promo Suplementos 15%',  'PORCENTUAL',  15.0, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), true),
    ('Descuento Equipamiento', 'MONTO_FIJO', 500.0, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), true)
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================================================
-- VERIFICACIÓN RÁPIDA
-- =============================================================================
SELECT 'usuarios'    AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL
SELECT 'categorias', COUNT(*) FROM categorias
UNION ALL
SELECT 'marcas',     COUNT(*) FROM marcas
UNION ALL
SELECT 'productos',  COUNT(*) FROM productos
UNION ALL
SELECT 'descuentos', COUNT(*) FROM descuentos;
