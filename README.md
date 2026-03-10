# MeanStore — Backend API

API REST desarrollada con Node.js + Express + MongoDB como parte del stack MEAN.

## 🛠️ Tecnologías

- **Node.js** + **Express** — servidor y rutas
- **MongoDB** + **Mongoose** — base de datos y modelos
- **JWT** — autenticación con tokens
- **bcryptjs** — encriptación de contraseñas

## 📁 Estructura del proyecto

```
Backend/
├── src/
│   ├── config/
│   │   └── db.js                            ← conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js               ← registro, login y promote-admin
│   │   ├── products.controller.js           ← CRUD de productos con 3 niveles de acceso
│   │   ├── cart.controller.js               ← carrito de compras
│   │   ├── sales.controller.js              ← ventas y compras con paginación
│   │   └── admin.controller.js              ← gestión de usuarios y dashboard
│   ├── middleware/
│   │   ├── auth.middleware.js               ← verificación de JWT y roles
│   │   ├── authValidator.middleware.js      ← validación de datos de auth y duplicados
│   │   ├── productValidator.middleware.js   ← validación de productos
│   │   ├── cartValidator.middleware.js      ← validación de carrito, stock y duplicados
│   │   ├── adminSecret.middleware.js        ← validación de clave secreta admin
│   │   └── dataBase.middleware.js           ← verificación de conexión BD
│   ├── models/
│   │   ├── user.js                          ← modelo de usuario
│   │   ├── product.js                       ← modelo de producto
│   │   ├── cart.js                          ← modelo de carrito
│   │   └── sale.js                          ← modelo de venta
│   ├── routes/
│   │   ├── auth.routes.js                   ← /auth
│   │   ├── products.routes.js               ← /products
│   │   ├── cart.routes.js                   ← /cart
│   │   ├── sales.routes.js                  ← /sales
│   │   └── admin.routes.js                  ← /admin
│   ├── utils/
│   │   └── appError.js                      ← clase de errores personalizados
│   ├── seed.js                              ← datos de prueba
│   ├── app.js                               ← configuración de Express
│   └── server.js                            ← punto de entrada
├── .env
├── .gitignore
└── package.json
```

## ⚙️ Instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/Samuel-M-I/MEANStore.git
cd MEANStore/Backend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

Crear un archivo `.env` en la raíz de `Backend/` con:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/meanstore
JWT_SECRET=tu_secreto_seguro_aqui
ADMIN_SECRET_KEY=tu_clave_secreta_admin
```

**4. Iniciar MongoDB**

```bash
net start MongoDB
```

**5. Cargar datos de prueba**

```bash
npm run seed
```

**6. Iniciar el servidor**

```bash
npm run dev
```

Deberías ver:

```
🚀 Server is running on port 4000
✅ DB connected to mongoDB
```

## 🔐 Roles del sistema

| Rol      | Permisos                                              |
| -------- | ----------------------------------------------------- |
| `admin`  | Acceso total — usuarios, productos, ventas, dashboard |
| `worker` | CRUD de productos y registro de ventas                |
| `client` | Ver catálogo, carrito e historial personal            |

### Asignación de roles

```
Registro  ──► role: "client"  (por defecto)
                    │
                    ▼
PATCH /auth/promote-admin + x-admin-secret  ──► role: "admin"
                    │
                    ▼
PUT /admin/users/:id/role  ──► role: "worker"  (el admin decide)
```

## 📡 Endpoints

### Auth — `/auth`

| Método | Ruta                  | Acceso                     | Descripción                                       |
| ------ | --------------------- | -------------------------- | ------------------------------------------------- |
| POST   | `/auth/register`      | Público                    | Registro — crea usuario y carrito automáticamente |
| POST   | `/auth/login`         | Público                    | Login — retorna JWT                               |
| PATCH  | `/auth/promote-admin` | `x-admin-secret` en header | Promueve un usuario a admin                       |

### Productos — `/products`

| Método | Ruta               | Acceso         | Descripción                                                                                |
| ------ | ------------------ | -------------- | ------------------------------------------------------------------------------------------ |
| GET    | `/products/public` | Público        | Solo productos activos con stock — info básica                                             |
| GET    | `/products/user`   | Client         | Productos activos con stock — info completa sin fechas. Soporta `?q=` y `?page=` `?limit=` |
| GET    | `/products`        | Worker / Admin | Todos los productos con toda la información. Soporta `?q=` y `?page=` `?limit=`            |
| GET    | `/products/:id`    | Worker / Admin | Detalle completo de un producto                                                            |
| POST   | `/products`        | Worker / Admin | Crear producto                                                                             |
| PUT    | `/products/:id`    | Worker / Admin | Editar producto                                                                            |
| DELETE | `/products/:id`    | Worker / Admin | Soft-delete — desactiva el producto                                                        |

### Carrito — `/cart`

| Método | Ruta        | Acceso | Descripción                                                  |
| ------ | ----------- | ------ | ------------------------------------------------------------ |
| GET    | `/cart`     | JWT    | Ver carrito del usuario                                      |
| POST   | `/cart/:id` | JWT    | Agregar producto — valida stock, disponibilidad y duplicados |
| PUT    | `/cart/:id` | JWT    | Actualizar cantidad — valida stock y disponibilidad          |
| DELETE | `/cart/:id` | JWT    | Eliminar producto del carrito                                |

### Ventas — `/sales`

| Método | Ruta             | Acceso | Descripción                                              |
| ------ | ---------------- | ------ | -------------------------------------------------------- |
| POST   | `/sales/add`     | JWT    | Confirmar compra — descuenta stock y vacía carrito       |
| GET    | `/sales/mySales` | JWT    | Historial personal del cliente                           |
| GET    | `/sales`         | Admin  | Todas las ventas del sistema. Soporta `?page=` `?limit=` |

### Admin — `/admin`

| Método | Ruta                          | Acceso | Descripción                                          |
| ------ | ----------------------------- | ------ | ---------------------------------------------------- |
| GET    | `/admin/dashboard`            | Admin  | Métricas del sistema — ventas, inventario y usuarios |
| GET    | `/admin/users`                | Admin  | Listar todos los usuarios                            |
| PUT    | `/admin/users/:userId/role`   | Admin  | Cambiar rol de usuario                               |
| PATCH  | `/admin/users/:userId/active` | Admin  | Activar / desactivar usuario                         |

## 📊 Dashboard Admin

`GET /admin/dashboard` retorna:

```json
{
    "resumenGeneral": {
        "totalUsuarios": 4,
        "totalProductos": 7,
        "totalVentas": 2
    },
    "ventasDelDia": {
        "cantidad": 1,
        "ingresos": 4500000
    },
    "ultimasVentas": [...],
    "inventario": {
        "stockBajo": [...],
        "sinStock": [...]
    }
}
```

## 👁️ Información visible por rol

### Productos

| Campo         | Sin login `/public` | Cliente `/user` | Worker/Admin `/` |
| ------------- | ------------------- | --------------- | ---------------- |
| `name`        | ✅                  | ✅              | ✅               |
| `price`       | ✅                  | ✅              | ✅               |
| `stock`       | ✅                  | ✅              | ✅               |
| `category`    | ✅                  | ✅              | ✅               |
| `imageUrl`    | ✅                  | ✅              | ✅               |
| `description` | ❌                  | ✅              | ✅               |
| `isActive`    | ❌                  | ✅              | ✅               |
| `createdBy`   | ❌                  | ✅ username     | ✅ username      |
| `createdAt`   | ❌                  | ❌              | ✅               |
| `updatedAt`   | ❌                  | ❌              | ✅               |
| Sin stock     | ❌                  | ❌              | ✅               |
| Inactivos     | ❌                  | ❌              | ✅               |

## 🛡️ Seguridad

Cada request pasa por estas capas antes de llegar al controlador:

```
Request → validateDataBase → validateDatos → protect → authorizenRoles → Controller
```

| Middleware              | Responsabilidad                                                              |
| ----------------------- | ---------------------------------------------------------------------------- |
| `validateDataBase`      | Verifica que MongoDB esté activo                                             |
| `validateRegister`      | Valida campos, formato y duplicados de registro                              |
| `validateLogin`         | Valida campos de login                                                       |
| `validateProduct`       | Valida nombre, descripción (máx 500 chars), precio, stock entero y categoría |
| `validateUpdateProduct` | Valida precio no negativo y stock entero al editar                           |
| `validateAddToCart`     | Verifica stock, disponibilidad, duplicados y cantidad al agregar             |
| `validateUpdateCart`    | Verifica stock y disponibilidad al actualizar cantidad                       |
| `validateAdminSecret`   | Verifica la clave secreta para promover admin                                |
| `protect`               | Verifica y decodifica el JWT — manejo específico por tipo de error           |
| `authorizenRoles`       | Verifica que el rol tenga acceso a la ruta                                   |

## 🚨 Manejo de errores

Todos los errores retornan este formato:

```json
{
  "error": "descripción del error",
  "status": "Error del cliente"
}
```

| Status | Tipo               | Ejemplo                                         |
| ------ | ------------------ | ----------------------------------------------- |
| `400`  | Error del cliente  | Campo requerido, duplicado o stock insuficiente |
| `401`  | Error del cliente  | Token inválido, expirado o no proporcionado     |
| `403`  | Error del cliente  | Rol insuficiente o clave secreta incorrecta     |
| `404`  | Error del cliente  | Recurso no encontrado                           |
| `500`  | Error del servidor | Error interno                                   |
| `503`  | Error del servidor | BD no disponible                                |

## 🧪 Credenciales de prueba

Ejecutar `npm run seed` para crear estos usuarios y 7 productos automáticamente:

| Rol    | Email                | Password   |
| ------ | -------------------- | ---------- |
| Admin  | admin@meanstore.com  | Admin1234  |
| Worker | worker@meanstore.com | Worker1234 |
| Client | client@meanstore.com | Client1234 |

### Productos seed

| Nombre         | Categoría  | Precio     | Stock |
| -------------- | ---------- | ---------- | ----- |
| iPhone 15 Pro  | Celulares  | $4.500.000 | 10    |
| MacBook Air M2 | Laptops    | $6.800.000 | 5     |
| AirPods Pro    | Audífonos  | $1.200.000 | 20    |
| iPad Air       | Tablets    | $3.200.000 | 8     |
| Cable USB-C    | Accesorios | $45.000    | 50    |
| Sony Alpha A7  | Cámaras    | $9.500.000 | 3     |
| Control PS5    | Gaming     | $380.000   | 15    |

## 🧪 Flujo de prueba completo

```
1. POST /auth/register          ← crear usuario (carrito se crea automáticamente)
2. POST /auth/login              ← obtener token JWT
3. GET  /products/public         ← ver catálogo sin login
4. GET  /products/user           ← ver catálogo como cliente (requiere token)
5. GET  /products?q=air&page=1   ← búsqueda con paginación (requiere admin/worker)
6. POST /cart/:id                ← agregar producto con { "qty": 1 }
7. GET  /cart                    ← verificar carrito
8. POST /sales/add               ← confirmar compra (body vacío)
9. GET  /sales/mySales           ← ver historial de compras
10. GET /admin/dashboard         ← métricas del sistema (requiere admin)
```

## 📦 Dependencias

| Paquete      | Versión | Uso                      |
| ------------ | ------- | ------------------------ |
| express      | ^5.2.1  | Framework HTTP           |
| mongoose     | ^9.2.4  | ODM para MongoDB         |
| bcryptjs     | ^2.4.3  | Hash de contraseñas      |
| jsonwebtoken | ^9.0.3  | Generación de JWT        |
| dotenv       | ^17.3.1 | Variables de entorno     |
| cors         | ^2.8.6  | Control de origen        |
| nodemon      | ^3.1.14 | Hot reload en desarrollo |
