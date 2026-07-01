# GymStore — E-Commerce de Suplementos

Plataforma de e-commerce orientada a la venta de suplementos y equipamiento de gimnasio, desarrollada como Trabajo Práctico Obligatorio para la materia **Aplicaciones Interactivas – UADE**.

El proyecto está compuesto por dos módulos independientes: una **API REST** (backend) y una **Single Page Application** (frontend).

---

## Grupo 12

| Nombre                      | Legajo   |
|-----------------------------|----------|
| Amistadi, Matias            | 1163830  |
| Frasca, Luciano             | 1164185  |
| Oliver Nacher, Manuel       | 1161721  |  |
| Ottati Ostiglia, Simon      | 1155931  |

**Profesora:** Cuello, Gisele Gabriela  
**Turno:** Jueves Noche – Curso 14792  
**Cuatrimestre:** 1° Cuatrimestre 2026

---

## Stack tecnológico

### Backend
- **Java 21** + **Spring Boot 4**
- **Spring Security** con autenticación stateless por **JWT**
- **Spring Data JPA / Hibernate**
- **MySQL 8**
- **Lombok** · **JJWT 0.11.5** · **Maven**

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** + **React-Redux** (estado global, thunks para CRUD asíncrono)
- **Axios** — cliente HTTP centralizado con interceptores (JWT + manejo de errores)
- **Tailwind CSS v4** + **shadcn/ui** + **Radix UI**
- **React Router DOM v7** (SPA)
- **lucide-react** (íconos)

---

## Requisitos previos

- **JDK 21** instalado y en `JAVA_HOME`
- **Maven 3.9+** (o usar el wrapper `./mvnw` incluido)
- **MySQL 8** corriendo en `localhost:3306`
- **Node.js v20+**

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Matiamistadi/Api-Ecommmerce-Tpo.git
cd Api-Ecommmerce-Tpo
```

### 2. Configurar y levantar el Backend

**2a. Crear la base de datos**

```sql
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2b. Configurar credenciales**

```bash
cp src/main/resources/application.properties.example src/main/resources/application-local.properties
```

Editar `application-local.properties` y completar:
- `TU_USUARIO_MYSQL` → usuario de MySQL (ej: `root`)
- `TU_PASSWORD_MYSQL` → contraseña de MySQL
- `TU_JWT_SECRET_BASE64_MINIMO_256_BITS` → clave secreta de 32+ bytes (ej: `openssl rand -hex 32`)

> El archivo `application-local.properties` está en `.gitignore` y nunca debe subirse al repositorio.

**2c. Cargar datos iniciales (recomendado para demo)**

```bash
mysql -u root -p ecommerce < init.sql
```

Esto crea:
- Usuario **ADMIN**: `admin@gym.com` / `Admin1234!`
- Usuario **CLIENTE**: `cliente@gym.com` / `Cliente123!`
- 5 categorías, 5 marcas, 6 productos de ejemplo y 2 descuentos activos

**2d. Compilar y ejecutar**

```bash
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8081`.

```bash
curl http://localhost:8081/status
# → "Servidor activo - Ecommerce Gym TPO"
```

---

### 3. Levantar el Frontend

```bash
cd Client
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> El frontend lee la URL del backend desde `Client/.env` (`VITE_API_URL`, ya incluido y apuntando a `http://localhost:8081`). Si no existe, cae a ese valor por defecto.

---

## Arquitectura de estado (Redux Toolkit)

El estado global se maneja con **Redux Toolkit**. Cada dominio funcional tiene su
slice y sus thunks en `Client/src/redux/features/`, con la **lógica asíncrona (thunks)
separada de la definición del estado (slice)**:

- `authThunks.js` / `authSlice.js` — login, registro, recuperar/reset password
- `productsThunks.js` / `productsSlice.js` — CRUD de catálogo
- `usersThunks.js` / `usersSlice.js` — usuarios (perfil, rol, baja, password)
- `direccionesThunks.js` / `direccionesSlice.js` — CRUD de direcciones
- `ordersThunks.js` / `ordersSlice.js` — órdenes (listar, cambiar estado, eliminar)
- `adminThunks.js` / `adminSlice.js` — resumen de métricas del panel admin
- `cartSlice.js` — carrito local (persistido en `localStorage`)

**Convenciones aplicadas:**
- Operaciones CRUD con `createAsyncThunk` (GET/POST/PUT/PATCH/DELETE).
- `extraReducers` con manejo de `pending` / `fulfilled` / `rejected` (unificados con
  `isAnyOf` cuando corresponde).
- Estados de carga separados: `loading` para lecturas y `saving` para mutaciones,
  más `error` por dominio.
- Todas las peticiones pasan por `services/axiosClient.js` (Axios con `baseURL` e
  interceptores de JWT y de errores 401/403/500).

---

## Funcionalidades del Frontend

### Tienda

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Home | Página principal con hero, beneficios, ofertas destacadas y newsletter |
| `/productos` | Catálogo | Listado con filtros por categoría, búsqueda y orden por precio |
| `/productos/:id` | Detalle | Detalle de producto con galería, descripción y selector de cantidad |
| `/carrito` | Carrito | Resumen de ítems, cantidades y total |
| `/checkout` | Checkout | Formulario de envío y confirmación de orden |
| `/confirmacion` | Confirmación | Pantalla de orden confirmada |
| `/login` | Login | Inicio de sesión |
| `/registro` | Registro | Creación de cuenta |
| `/perfil` | Mi Perfil | Datos personales, historial de pedidos y direcciones |

### Panel de administración (`/admin`)

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/admin/dashboard` | Dashboard | Métricas generales de ventas |
| `/admin/productos` | Productos | CRUD de catálogo |
| `/admin/pedidos` | Pedidos | Listado y gestión de órdenes |
| `/admin/clientes` | Clientes | Listado de usuarios registrados |
| `/admin/analiticas` | Analíticas | Gráficos de ventas y desempeño |
| `/admin/ajustes` | Ajustes | Configuración general de la tienda |

---

## API REST – Endpoints principales

### Autenticación (público)

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/authenticate` | Login → devuelve JWT |
| POST | `/api/v1/auth/forgot-password` | Iniciar recuperación de contraseña |
| POST | `/api/v1/auth/reset-password` | Restablecer contraseña con código |

### Productos

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| GET | `/api/productos` | Público | Listar todos |
| GET | `/api/productos/{id}` | Público | Obtener por id |
| GET | `/api/productos/categoria/{id}` | Público | Filtrar por categoría |
| POST | `/api/productos` | ADMIN | Crear producto |
| PUT | `/api/productos/{id}` | ADMIN | Actualizar producto |
| DELETE | `/api/productos/{id}` | ADMIN | Eliminar producto |

### Carrito y Órdenes

| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| GET | `/api/carritos/usuario/{id}` | CLIENTE | Ver carrito del usuario |
| POST | `/api/carritos/{id}/items` | CLIENTE | Agregar ítem |
| POST | `/api/carritos/{id}/confirmar` | CLIENTE | Confirmar → genera orden |
| GET | `/api/ordenes/usuario/{id}` | CLIENTE | Historial de órdenes |
| GET | `/api/ordenes` | ADMIN | Listar todas las órdenes |
| PATCH | `/api/ordenes/{id}/estado` | ADMIN | Cambiar estado de orden |
| DELETE | `/api/ordenes/{id}` | ADMIN | Eliminar orden (y su pago) |

> La colección completa de endpoints (55 requests) está disponible en `postman_collection.json` e `Insomnia_TPO-Ecomercce.yaml` en la raíz del proyecto.

---

## Seguridad

- Contraseñas hasheadas con **BCrypt**
- Tokens **JWT** firmados con HMAC-SHA256, expiración de 24 horas
- Servidor **stateless** (sin sesiones en memoria)
- Roles: `ADMIN` (gestión completa) y `CLIENTE` (operaciones propias)
- Endpoints públicos: catálogo de lectura, registro y login

---

## Estructura del repositorio

```
Api-Ecommmerce-Tpo/
├── src/                        # Backend – Spring Boot
│   └── main/
│       ├── java/.../           # config, controller, dto, entity, repository, service
│       └── resources/
│           ├── application.properties
│           └── application.properties.example
├── Client/                     # Frontend – React + Vite
│   ├── .env                    # VITE_API_URL (apunta al backend)
│   └── src/
│       ├── redux/
│       │   ├── store.js        # configureStore con todos los reducers
│       │   └── features/       # por dominio: <dominio>Slice.js + <dominio>Thunks.js
│       ├── services/           # axiosClient + servicios HTTP por dominio
│       ├── components/         # Header, Footer, ProductCard, FilterSidebar, AdminLayout...
│       ├── views/              # Todas las pantallas (Home, Catálogo, Admin, etc.)
│       ├── context/            # ToastContext (notificaciones de UI)
│       └── lib/                # helpers (formato, rating, utils)
├── init.sql                    # Script de carga inicial para demo
├── postman_collection.json     # Colección Postman
├── Insomnia_TPO-Ecomercce.yaml # Colección Insomnia
└── README.md
```
