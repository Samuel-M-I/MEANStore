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
│   │   └── db.js                        ← conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js           ← registro y login
│   │   ├── products.controller.js       ← CRUD de productos
│   │   ├── cart.controller.js           ← carrito de compras
│   │   ├── sales.controller.js          ← ventas y compras
│   │   └── admin.controller.js          ← gestión de usuarios
│   ├── middleware/
│   │   ├── auth.middleware.js           ← verificación de JWT y roles
│   │   ├── authValidator.middleware.js  ← validación de datos de auth
│   │   ├── productValidator.middleware.js ← validación de productos
│   │   └── dataBase.middleware.js       ← verificación de conexión BD
│   ├── models/
│   │   ├── user.js                      ← modelo de usuario
│   │   ├── product.js                   ← modelo de producto
│   │   ├── cart.js                      ← modelo de carrito
│   │   └── sale.js                      ← modelo de venta
│   ├── routes/
│   │   ├── auth.routes.js               ← /auth
│   │   ├── products.routes.js           ← /products
│   │   ├── cart.routes.js               ← /cart
│   │   ├── sales.routes.js              ← /sales
│   │   └── admin.routes.js              ← /admin
│   ├── utils/
│   │   └── appError.js                  ← clase de errores personalizados
│   ├── app.js                           ← configuración de Express
│   └── server.js                        ← punto de entrada
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
```

**4. Iniciar MongoDB**

```bash
net start MongoDB
```

**5. Iniciar el servidor**

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
| `client` | Ver catálogo, carrito y historial personal            |

## 📡 Endpoints

### Auth — `/auth`

| Método | Ruta             | Acceso  | Descripción               |
| ------ | ---------------- | ------- | ------------------------- |
| POST   | `/auth/register` | Público | Registro de nuevo cliente |
| POST   | `/auth/login`    | Público | Login — retorna JWT       |

### Productos — `/products`

| Método | Ruta               | Acceso         | Descripción                       |
| ------ | ------------------ | -------------- | --------------------------------- |
| GET    | `/products/public` | Público        | Catálogo visible sin login        |
| GET    | `/products`        | JWT            | Lista completa con búsqueda `?q=` |
| GET    | `/products/:id`    | JWT            | Detalle de un producto            |
| POST   | `/products`        | Admin / Worker | Crear producto                    |
| PUT    | `/products/:id`    | Admin / Worker | Editar producto                   |
| DELETE | `/products/:id`    | Admin / Worker | Soft-delete                       |

### Carrito — `/cart`

| Método | Ruta        | Acceso | Descripción                   |
| ------ | ----------- | ------ | ----------------------------- |
| GET    | `/cart`     | JWT    | Ver carrito del usuario       |
| POST   | `/cart/:id` | JWT    | Agregar producto al carrito   |
| PUT    | `/cart/:id` | JWT    | Actualizar cantidad           |
| DELETE | `/cart/:id` | JWT    | Eliminar producto del carrito |

### Ventas — `/sales`

| Método | Ruta             | Acceso | Descripción                        |
| ------ | ---------------- | ------ | ---------------------------------- |
| POST   | `/sales/add`     | JWT    | Confirmar compra y descontar stock |
| GET    | `/sales/mySales` | JWT    | Historial personal del cliente     |
| GET    | `/sales`         | Admin  | Todas las ventas del sistema       |

### Admin — `/admin`

| Método | Ruta                          | Acceso | Descripción                  |
| ------ | ----------------------------- | ------ | ---------------------------- |
| GET    | `/admin/users`                | Admin  | Listar todos los usuarios    |
| PUT    | `/admin/users/:userId/role`   | Admin  | Cambiar rol de usuario       |
| PATCH  | `/admin/users/:userId/active` | Admin  | Activar / desactivar usuario |

## 🛡️ Seguridad

Cada request pasa por estas capas antes de llegar al controlador:

```
Request → validateDataBase → validateDatos → protect → authorizenRoles → Controller
```

- **validateDataBase** — verifica que MongoDB esté activo
- **validateDatos** — valida que los campos requeridos estén presentes y con formato correcto
- **protect** — verifica y decodifica el JWT
- **authorizenRoles** — verifica que el rol del usuario tenga acceso a la ruta

## 🚨 Manejo de errores

Todos los errores retornan este formato:

```json
{
  "error": "descripción del error",
  "status": "Error del cliente"
}
```

| Status | Tipo               | Ejemplo                   |
| ------ | ------------------ | ------------------------- |
| `400`  | Error del cliente  | Campo requerido faltante  |
| `401`  | Error del cliente  | Token inválido o expirado |
| `403`  | Error del cliente  | Rol insuficiente          |
| `404`  | Error del cliente  | Recurso no encontrado     |
| `500`  | Error del servidor | Error interno             |
| `503`  | Error del servidor | BD no disponible          |

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
