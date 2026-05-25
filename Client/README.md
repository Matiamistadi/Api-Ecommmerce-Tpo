# GymStore — Frontend

Frontend del e-commerce de suplementos y equipamiento de gimnasio "GymStore", desarrollado como parte del TPO de la materia.

## Stack tecnológico

- **React 19** — biblioteca de UI basada en componentes
- **Vite 7** — herramienta de desarrollo con HMR
- **React Router DOM** — manejo de rutas y navegación SPA
- **JavaScript** + CSS modular con variables globales

## Cómo ejecutar

Prerrequisito: tener Node.js v20 o superior instalado.

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
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── FilterSidebar.jsx
│   ├── views/              # Pantallas completas
│   │   ├── Home.jsx
│   │   ├── Catalogo.jsx
│   │   ├── DetalleProducto.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Carrito.jsx
│   │   ├── MiPerfil.jsx
│   │   └── NotFound.jsx
│   ├── data/               # Datos hardcodeados (futura conexión a API)
│   │   └── productos.js
│   ├── App.jsx             # Configuración de rutas
│   ├── App.css
│   ├── index.css           # Design system (CSS variables globales)
│   └── main.jsx            # Punto de entrada con BrowserRouter
├── index.html
├── package.json
└── vite.config.js
```

## Rutas disponibles

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Home | Página de inicio con hero y CTA |
| `/suplementos` | Catalogo | Catálogo con filtro por categoría (useState) |
| `/producto/:id` | DetalleProducto | Detalle dinámico de un producto (useParams) |
| `/login` | Login | Formulario de inicio de sesión con inputs controlados |
| `/registro` | Registro | Registro de usuario (en construcción) |
| `/carrito` | Carrito | Carrito de compras (en construcción) |
| `/perfil` | MiPerfil | Perfil de usuario (en construcción) |
| `*` | NotFound | Página 404 para rutas no existentes |

## Conceptos React aplicados

- Componentes funcionales con arrow functions
- Props y flujo unidireccional de datos
- `useState` para estado local (filtros, cantidad, formularios)
- `useParams` para leer parámetros de URL en rutas dinámicas
- `Link` y `NavLink` para navegación sin recarga (SPA)
- Render condicional con operadores `&&` y ternarios
- Renderizado de listas con `.map()` y prop `key`
- CSS modular por componente con variables globales

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
