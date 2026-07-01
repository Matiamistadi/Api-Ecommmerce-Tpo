# GymStore — Frontend

Frontend del e-commerce de suplementos y equipamiento de gimnasio "GymStore", desarrollado como parte del TPO de la materia. Consume la API REST del backend (Spring Boot) para productos, usuarios, carritos, órdenes, direcciones y reseñas — no hay datos mockeados.

## Stack tecnológico

- **React 19** — biblioteca de UI basada en componentes
- **Vite 8** — herramienta de desarrollo con HMR
- **React Router DOM** — manejo de rutas y navegación SPA
- **Redux Toolkit + React Redux** — estado global (auth, carrito, productos)
- **Axios** — cliente HTTP hacia el backend, con interceptores de token y manejo de sesión vencida
- **Tailwind CSS** + CSS modular por componente

## Cómo ejecutar

Prerrequisito: tener Node.js v20+ y el backend corriendo en `http://localhost:8081` (configurable con `VITE_API_URL`).

```bash
cd Client
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Estructura del proyecto

```
Client/
├── src/
│   ├── components/         # Componentes reutilizables (Header, ProductCard, AdminSidebar, etc.)
│   ├── views/              # Pantallas completas (Home, Catalogo, Checkout, Admin*, etc.)
│   ├── context/            # Context API solo para UI efímera (ToastContext)
│   ├── redux/
│   │   ├── store.js            # configureStore() — combina los reducers
│   │   └── features/
│   │       ├── authSlice.js        # sesión de usuario (login/registro vía thunks)
│   │       ├── cartSlice.js        # carrito de compras (persistido en localStorage)
│   │       ├── productsSlice.js    # productos: GET/POST/PUT/DELETE vía thunks
│   │       ├── usersSlice.js       # usuarios: GET/PUT/PATCH (perfil, password, suspender)
│   │       ├── direccionesSlice.js # direcciones de envío: GET/POST/DELETE
│   │       ├── ordersSlice.js      # pedidos/órdenes: GET (usuario y admin) + PATCH estado
│   │       └── adminSlice.js       # resumen combinado (métricas, clientes, ventas) para el panel admin
│   ├── services/           # Llamadas a la API (axiosClient + un service por entidad)
│   ├── lib/                 # Helpers (formato, ratings, utils)
│   ├── App.jsx              # Definición de rutas
│   └── main.jsx             # Punto de entrada: <Provider> + <BrowserRouter>
├── index.html
├── package.json
└── vite.config.js
```

## Estado global con Redux Toolkit

- **Store**: `src/redux/store.js`, creado con `configureStore()`. El middleware Thunk viene habilitado por defecto en RTK.
- **`<Provider store={store}>`** envuelve `<App />` en `main.jsx`.
- **Slices** (uno por dominio funcional, cada uno con su propio `loading`/`error` en `extraReducers`):
  - `authSlice` — `loginUser` y `registerUser` (`createAsyncThunk`, POST contra `/api/v1/auth/authenticate` y `/register`).
  - `cartSlice` — reducers síncronos (`agregarAlCarrito`, `eliminarDelCarrito`, `actualizarCantidad`, `vaciarCarrito`), persistidos en `localStorage` (no requiere backend).
  - `productsSlice` — CRUD completo: `fetchProductos` (GET), `agregarProducto` (POST), `actualizarProducto`/`reemplazarImagenProducto` (PUT), `eliminarProducto` (DELETE), `toggleActivo` (PATCH).
  - `usersSlice` — `fetchUsuarios`/`fetchUsuarioActual` (GET), `actualizarUsuario` (PUT, usado para editar perfil, cambiar password y suspender/reactivar), `cambiarPassword` (PATCH).
  - `direccionesSlice` — `fetchDirecciones` (GET), `crearDireccion` (POST), `eliminarDireccion` (DELETE).
  - `ordersSlice` — `fetchOrdenesUsuario`/`fetchTodasLasOrdenes` (GET), `actualizarEstadoOrden` (PATCH).
  - `adminSlice` — `fetchResumenAdmin` (GET combinado de órdenes + usuarios) para las métricas del dashboard, analíticas y listado de clientes.
- Los componentes leen el store con `useSelector` (selectores exportados desde cada slice) y disparan acciones con `useDispatch`; no quedan estados locales duplicando datos que ya viven en Redux.
- Los thunks usan `rejectWithValue` con el `Error` original, así los componentes pueden seguir haciendo `dispatch(thunk(...)).unwrap().catch(err => err.message)` igual que con una promesa común.
- `axiosClient.js` centraliza la `baseURL`, agrega el JWT en cada request y, si el backend responde 401, dispara el evento `sesion-expirada` que el store escucha para deslogear automáticamente.

## Rutas principales

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Home | Inicio, hero y productos destacados |
| `/productos`, `/suplementos` | Catalogo | Catálogo con filtros y búsqueda |
| `/producto/:id`, `/productos/:id` | DetalleProducto | Detalle de producto + reseñas |
| `/login`, `/registro` | Login / Registro | Autenticación contra el backend |
| `/carrito` | Carrito | Carrito de compras |
| `/checkout` | Checkout | Checkout con cupón y dirección |
| `/perfil` | MiPerfil | Datos del usuario, direcciones y pedidos |
| `/admin/*` | Admin* | Panel de administración (productos, pedidos, clientes, dashboard, analíticas, ajustes) |
| `*` | NotFound | Página 404 |

## Conceptos aplicados

- Componentes funcionales con arrow functions y hooks (`useState`, `useEffect`, `useParams`)
- Estado global con Redux Toolkit (`createSlice`, `createAsyncThunk`, `useSelector`/`useDispatch`)
- Llamadas asíncronas a la API con Axios, manejo de errores y estados de carga
- `Link` / `NavLink` para navegación SPA
- Render condicional y renderizado de listas con `.map()`

## Design system

Paleta "High-Performance Athletic":
- **Dark Navy** `#1a1a2e` (primario)
- **Electric Green** `#00d4aa` (acento)
- Tipografía: **Plus Jakarta Sans** (titulares) + **Inter** (cuerpo)

## Integrantes

- Matías Amistadi
- Manuel Oliver Nacher
- Luciano Frasca
- Nicolás Oroño
- Simón Ottati
