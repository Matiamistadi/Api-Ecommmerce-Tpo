# API Ecommerce Gym TPO

API REST para una plataforma de e-commerce orientada a la venta de suplementos y equipamiento de gimnasio.

## Objetivo
Desarrollar una plataforma e-commerce que permita:
- visualizar productos
- gestionar publicaciones de productos
- administrar usuarios compradores y vendedores
- manejar carrito de compras y checkout

## Tecnologías
- Java 21
- Spring Boot
- Maven
- Lombok

## Ejecución del proyecto
1. Clonar el repositorio
2. Abrir el proyecto en IntelliJ o VS Code
3. Ejecutar la clase principal `EcommmerceApplication`
4. La API quedará disponible en `http://localhost:8080`

## Endpoints iniciales

### 1. GET /status
Verifica que la API esté activa.  
**Recurso:** estado de la aplicación.

### 2. GET /api/productos
Obtiene el listado de productos disponibles.  
**Recurso:** productos.

### 3. POST /api/productos
Crea un nuevo producto.  
**Recurso:** productos.

## Endpoints actualmente implementados
- GET `/status`
- GET `/api/productos`
- GET `/api/productos/{id}`
- POST `/api/productos`
- PUT `/api/productos/{id}`
- DELETE `/api/productos/{id}`

## Estado actual
- Estructura inicial del proyecto creada
- Conexión con repositorio GitHub realizada
- Endpoints de prueba de productos implementados
- Persistencia aún no implementada
- Módulos de usuario y carrito pendientes de desarrollo

## Próximos pasos
- Resolver capa de persistencia
- Modelar entidades Usuario, Producto, Carrito e ItemCarrito
- Implementar repositorios con Spring Data JPA
- Agregar validaciones y manejo de errores
- Documentar pruebas en Postman/Insomnia

## Integrantes
- Matias Amistadi
- Manuel Oliver Nacher
- Luciano Frasca
- Nicolas Oroño
- Simon Ottati