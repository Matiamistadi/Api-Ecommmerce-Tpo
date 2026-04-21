# API Ecommerce Gym TPO – UADE

API REST para una plataforma de e-commerce orientada a la venta de suplementos y equipamiento de gimnasio.  
Implementada con **Spring Boot 4**, **Spring Security + JWT** y persistencia en **MySQL**.

**Repositorio:** https://github.com/Matiamistadi/Api-Ecommmerce-Tpo

---

## Grupo 12 – Integrantes

| Nombre                      | Legajo   |
|-----------------------------|----------|
| Amistadi, Matias            | 1163830  |
| Frasca, Luciano             | 1164185  |
| Oliver Nacher, Manuel       | 1161721  |
| Oroño, Nicolás Ezequiel     | 1158650  |
| Ottati Ostiglia, Simon      | 1155931  |

**Materia:** Aplicaciones Interactivas  
**Profesora:** Cuello, Gisele Gabriela  
**Turno:** Jueves Noche – Curso 14792  
**Cuatrimestre:** 1° Cuatrimestre 2026

---

## Tecnologías

- Java 21
- Spring Boot 4.0.5
- Spring Security (JWT stateless)
- Spring Data JPA / Hibernate
- MySQL 8
- Lombok
- JJWT 0.11.5
- Maven

---

## Requisitos previos

- JDK 21 instalado y configurado en `JAVA_HOME`
- Maven 3.9+ (o usar el wrapper `./mvnw`)
- MySQL 8 corriendo localmente en el puerto `3306`
- (Opcional) MySQL Workbench para visualizar las tablas

---

## Ejecución local paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Matiamistadi/Api-Ecommmerce-Tpo.git
cd Api-Ecommmerce-Tpo
```

### 2. Crear la base de datos

```sql
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configurar credenciales

Copiar el archivo de ejemplo y completar con tus datos:

```bash
cp src/main/resources/application.properties.example src/main/resources/application-local.properties
```

Editar `application-local.properties` y reemplazar:
- `TU_USUARIO_MYSQL` → tu usuario de MySQL (ej: `root`)
- `TU_PASSWORD_MYSQL` → tu contraseña de MySQL
- `TU_JWT_SECRET_BASE64_MINIMO_256_BITS` → clave secreta (mínimo 32 bytes en hex, ej: generada con `openssl rand -hex 32`)

> **Nota de seguridad:** El archivo `application-local.properties` está en `.gitignore` y nunca debe subirse al repositorio.

### 4. Cargar datos iniciales (opcional pero recomendado para demo)

```bash
mysql -u root -p ecommerce < init.sql
```

Esto crea:
- Usuario **ADMIN**: `admin@gym.com` / `Admin1234!`
- Usuario **CLIENTE**: `cliente@gym.com` / `Cliente123!`
- 5 categorías, 5 marcas y 6 productos de ejemplo
- 2 descuentos activos

### 5. Compilar y ejecutar

```bash
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`

Para verificar que arrancó bien:

```bash
curl http://localhost:8080/status
# Debería devolver: "Servidor activo - Ecommerce Gym TPO"
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cliente HTTP                             │
│                  (Postman / Insomnia / App)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP Request
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Security Filter Chain                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  JwtAuthenticationFilter (OncePerRequestFilter)          │   │
│  │  1. Extrae "Authorization: Bearer <token>"               │   │
│  │  2. Valida firma y expiración del JWT                    │   │
│  │  3. Carga UserDetails (Usuario) desde BD                 │   │
│  │  4. Popula SecurityContextHolder                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SecurityConfig – reglas de autorización por rol         │   │
│  │  ADMIN: gestión catálogo, órdenes, usuarios              │   │
│  │  CLIENTE: carrito, órdenes propias, pagos                │   │
│  │  Público: catálogo (GET), register, login                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Capa de Controllers                         │
│  AuthController · ProductoController · CategoriaController      │
│  MarcaController · CarritoController · OrdenController          │
│  DescuentoController · PagoController · UsuarioController       │
│  DireccionController · StatusController                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Capa de Services                           │
│  AuthenticationService · ProductoServiceImpl                    │
│  CarritoServiceImpl · OrdenServiceImpl · PagoServiceImpl        │
│  CategoriaServiceImpl · MarcaServiceImpl · DescuentoServiceImpl │
│  UsuarioServiceImpl · DireccionServiceImpl                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Capa de Repositories                         │
│             (Spring Data JPA – JpaRepository<T, Long>)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL 8 – BD "ecommerce"                     │
│  usuarios · productos · categorias · marcas · imagenes_producto │
│  carritos · items_carrito · ordenes · items_orden               │
│  descuentos · producto_descuento · pagos · direcciones          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Seguridad JWT – Flujo

```
1. POST /api/v1/auth/register  →  Usuario creado, JWT retornado
2. POST /api/v1/auth/authenticate  →  Credenciales validadas, JWT retornado

Uso del token en requests protegidos:
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

El JWT contiene:
   - sub: email del usuario
   - iat: fecha de emisión
   - exp: fecha de expiración (24 horas)
   - Firmado con HMAC-SHA256
```

**Seguridad aplicada:**
- Contraseñas hasheadas con **BCrypt** (nunca en texto plano)
- `UserDetailsService` carga usuarios desde MySQL por email
- `JwtAuthenticationFilter` valida cada request y popula el `SecurityContextHolder`
- `SessionCreationPolicy.STATELESS` – el servidor no mantiene sesiones
- Separación estricta de roles: ADMIN vs CLIENTE

---

## Entidades y tablas (Entidad ↔ Clase Java ↔ Tabla BD)

| Entidad Java         | Tabla BD               | Descripción                         |
|----------------------|------------------------|-------------------------------------|
| `Usuario`            | `usuarios`             | Usuarios del sistema con rol        |
| `Producto`           | `productos`            | Productos del catálogo              |
| `Categoria`          | `categorias`           | Categorías de productos             |
| `Marca`              | `marcas`               | Marcas de productos                 |
| `ImagenProducto`     | `imagenes_producto`    | Imágenes asociadas a productos      |
| `Carrito`            | `carritos`             | Carrito de compras del usuario      |
| `ItemCarrito`        | `items_carrito`        | Ítems dentro del carrito            |
| `Orden`              | `ordenes`              | Orden generada al confirmar carrito |
| `ItemOrden`          | `items_orden`          | Ítems dentro de la orden            |
| `Descuento`          | `descuentos`           | Descuentos configurables            |
| `ProductoDescuento`  | `producto_descuento`   | Relación producto ↔ descuento       |
| `Pago`               | `pagos`                | Registro de pago de una orden       |
| `Direccion`          | `direcciones`          | Direcciones de envío del usuario    |

---

## Endpoints

### Autenticación (público)

| Método | URL                         | Body / Params               | Respuesta          |
|--------|-----------------------------|-----------------------------|--------------------|
| POST   | `/api/v1/auth/register`     | `{ email, password }`       | `{ access_token }` |
| POST   | `/api/v1/auth/authenticate` | `{ email, password }`       | `{ access_token }` |
| GET    | `/status`                   | —                           | String             |

### Productos

| Método | URL                                   | Auth / Rol   | Descripción                    |
|--------|---------------------------------------|--------------|--------------------------------|
| GET    | `/api/productos`                      | Público      | Listar todos los productos     |
| GET    | `/api/productos/{id}`                 | Público      | Obtener producto por id        |
| GET    | `/api/productos/categoria/{id}`       | Público      | Filtrar por categoría          |
| GET    | `/api/productos/marca/{id}`           | Público      | Filtrar por marca              |
| POST   | `/api/productos`                      | ADMIN        | Crear producto                 |
| PUT    | `/api/productos/{id}`                 | ADMIN        | Actualizar producto            |
| DELETE | `/api/productos/{id}`                 | ADMIN        | Eliminar producto              |
| POST   | `/api/productos/{id}/imagenes`        | ADMIN        | Agregar imagen al producto     |
| DELETE | `/api/productos/{id}/imagenes/{imgId}`| ADMIN        | Eliminar imagen                |

### Categorías

| Método | URL                    | Auth / Rol | Descripción           |
|--------|------------------------|------------|-----------------------|
| GET    | `/api/categorias`      | Público    | Listar categorías     |
| GET    | `/api/categorias/{id}` | Público    | Obtener por id        |
| POST   | `/api/categorias`      | ADMIN      | Crear categoría       |
| PUT    | `/api/categorias/{id}` | ADMIN      | Actualizar categoría  |
| DELETE | `/api/categorias/{id}` | ADMIN      | Eliminar categoría    |

### Marcas

| Método | URL               | Auth / Rol | Descripción       |
|--------|-------------------|------------|-------------------|
| GET    | `/api/marcas`     | Público    | Listar marcas     |
| GET    | `/api/marcas/{id}`| Público    | Obtener por id    |
| POST   | `/api/marcas`     | ADMIN      | Crear marca       |
| PUT    | `/api/marcas/{id}`| ADMIN      | Actualizar marca  |
| DELETE | `/api/marcas/{id}`| ADMIN      | Eliminar marca    |

### Carrito

| Método | URL                                              | Auth / Rol      | Descripción                   |
|--------|--------------------------------------------------|-----------------|-------------------------------|
| GET    | `/api/carritos/{id}`                             | CLIENTE / ADMIN | Obtener carrito por id        |
| GET    | `/api/carritos/usuario/{usuarioId}`              | CLIENTE / ADMIN | Obtener carrito del usuario   |
| POST   | `/api/carritos/usuario/{usuarioId}`              | CLIENTE / ADMIN | Crear carrito                 |
| POST   | `/api/carritos/{id}/items?productoId=&cantidad=` | CLIENTE / ADMIN | Agregar ítem al carrito       |
| DELETE | `/api/carritos/{id}/items/{itemId}`              | CLIENTE / ADMIN | Eliminar ítem                 |
| DELETE | `/api/carritos/{id}/vaciar`                      | CLIENTE / ADMIN | Vaciar carrito                |
| POST   | `/api/carritos/{id}/confirmar?direccionEnvioId=` | CLIENTE / ADMIN | Confirmar → genera una Orden  |

### Órdenes

| Método | URL                              | Auth / Rol      | Descripción                    |
|--------|----------------------------------|-----------------|--------------------------------|
| GET    | `/api/ordenes`                   | ADMIN           | Listar todas las órdenes       |
| GET    | `/api/ordenes/{id}`              | Autenticado     | Obtener orden por id           |
| GET    | `/api/ordenes/usuario/{id}`      | CLIENTE / ADMIN | Órdenes de un usuario          |
| PATCH  | `/api/ordenes/{id}/estado`       | ADMIN           | Cambiar estado de la orden     |

### Descuentos

| Método | URL                                         | Auth / Rol | Descripción                      |
|--------|---------------------------------------------|------------|----------------------------------|
| GET    | `/api/descuentos`                           | Público    | Listar descuentos                |
| GET    | `/api/descuentos/{id}`                      | Público    | Obtener por id                   |
| POST   | `/api/descuentos`                           | ADMIN      | Crear descuento                  |
| PUT    | `/api/descuentos/{id}`                      | ADMIN      | Actualizar descuento             |
| DELETE | `/api/descuentos/{id}`                      | ADMIN      | Eliminar descuento               |
| POST   | `/api/descuentos/{id}/productos/{productoId}` | ADMIN    | Aplicar descuento a producto     |
| DELETE | `/api/descuentos/{id}/productos/{productoId}` | ADMIN    | Quitar descuento de producto     |

### Pagos

| Método | URL                          | Auth / Rol      | Descripción              |
|--------|------------------------------|-----------------|--------------------------|
| GET    | `/api/pagos/{id}`            | CLIENTE / ADMIN | Obtener pago por id      |
| GET    | `/api/pagos/orden/{ordenId}` | CLIENTE / ADMIN | Obtener pago de una orden|
| POST   | `/api/pagos/orden/{ordenId}` | CLIENTE / ADMIN | Registrar pago           |

### Direcciones

| Método | URL                                          | Auth / Rol      | Descripción                       |
|--------|----------------------------------------------|-----------------|-----------------------------------|
| GET    | `/api/usuarios/{usuarioId}/direcciones`      | CLIENTE / ADMIN | Listar direcciones del usuario    |
| GET    | `/api/usuarios/{usuarioId}/direcciones/{id}` | CLIENTE / ADMIN | Obtener dirección por id          |
| POST   | `/api/usuarios/{usuarioId}/direcciones`      | CLIENTE / ADMIN | Crear dirección para el usuario   |
| PUT    | `/api/usuarios/{usuarioId}/direcciones/{id}` | CLIENTE / ADMIN | Actualizar dirección              |
| DELETE | `/api/usuarios/{usuarioId}/direcciones/{id}` | CLIENTE / ADMIN | Eliminar dirección                |

### Usuarios

| Método | URL                    | Auth / Rol            | Descripción                       |
|--------|------------------------|-----------------------|-----------------------------------|
| GET    | `/api/usuarios`        | ADMIN                 | Listar todos los usuarios         |
| GET    | `/api/usuarios/{id}`   | Autenticado           | Obtener usuario por id            |
| PUT    | `/api/usuarios/{id}`   | Propietario / ADMIN   | Actualizar datos del usuario      |
| PATCH  | `/api/usuarios/{id}/rol` | ADMIN               | Cambiar el rol de un usuario      |
| DELETE | `/api/usuarios/{id}`   | Autenticado           | Eliminar usuario                  |

---

## Cómo probar la API

### Opción 1 – Postman

1. Importar el archivo `postman_collection.json` desde la raíz del proyecto.
2. Ejecutar **POST Login** → el token se guarda automáticamente en la variable `{{token}}`.
3. Probar cualquier endpoint protegido — la colección ya inyecta el token en el header.
4. Para probar autorización: intentar un endpoint ADMIN con token CLIENTE → debe devolver **403 Forbidden**.
5. Intentar un endpoint protegido sin token → debe devolver **401 Unauthorized**.

### Opción 2 – Insomnia

1. Importar el archivo `Insomnia_TPO-Ecomercce.yaml` desde la raíz del proyecto (File → Import).
2. La colección contiene los 55 requests organizados por entidad, ya configurados con los tokens de prueba.

### Ejemplo rápido con curl – login y uso del token

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"Admin1234!"}' | jq -r .access_token)

# 2. Usar el token en un endpoint protegido
curl http://localhost:8080/api/productos \
  -H "Authorization: Bearer $TOKEN"
```

---

## Roles y permisos

| Rol      | Permisos                                                                                      |
|----------|-----------------------------------------------------------------------------------------------|
| `ADMIN`  | CRUD completo de catálogo (productos, categorías, marcas, descuentos), gestión de órdenes y usuarios |
| `CLIENTE`| Carrito, órdenes propias, pagos, gestión de su perfil y direcciones                           |
| Público  | Lectura de catálogo (productos, categorías, marcas, descuentos), registro y login             |

### Promover un usuario a ADMIN

Por seguridad, el endpoint público de registro sólo crea usuarios con rol `CLIENTE`. Para crear un administrador, ejecutar directamente en MySQL:

```sql
UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'admin@gym.com';
```

---

## Manejo de errores

El `GlobalExceptionHandler` devuelve respuestas consistentes en formato JSON:

| Código | Situación                                          |
|--------|----------------------------------------------------|
| 400    | Datos inválidos (validación de campos)             |
| 401    | Token ausente, inválido o expirado                 |
| 403    | Usuario autenticado sin permisos suficientes       |
| 404    | Recurso no encontrado                              |
| 409    | Conflicto (ej: email ya registrado)                |
| 500    | Error interno del servidor                         |

Ejemplo de respuesta de error:
```json
{
  "timestamp": "2026-04-19T19:15:03",
  "status": 403,
  "error": "Forbidden",
  "mensaje": "Acceso denegado: permisos insuficientes"
}
```

---

## Estructura del proyecto

```
src/
└── main/
    ├── java/com/uade/tpo/ecommerce/
    │   ├── config/          # Spring Security, JWT, ApplicationConfig
    │   ├── controller/      # REST Controllers
    │   ├── dto/             # Data Transfer Objects
    │   ├── entity/          # Entidades JPA (13 entidades)
    │   ├── exception/       # GlobalExceptionHandler
    │   ├── repository/      # JPA Repositories
    │   └── service/         # Lógica de negocio (interfaces + implementaciones)
    └── resources/
        ├── application.properties         # Config base (usa variables de entorno)
        └── application.properties.example # Plantilla sin credenciales
init.sql                    # Script de datos iniciales para demo
postman_collection.json     # Colección Postman lista para importar
Insomnia_TPO-Ecomercce.yaml # Colección Insomnia con los 55 requests
README.md                   # Este archivo
```