const express  = require('express');
const cors     = require('cors');

const authRoutes     = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const cartRoutes     = require('./routes/cart.routes');
const salesRoutes    = require('./routes/sales.routes');
const adminRoutes    = require('./routes/admin.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/auth',     authRoutes);
app.use('/products', productsRoutes);
app.use('/cart',     cartRoutes);
app.use('/sales',    salesRoutes);
app.use('/admin',    adminRoutes);

// ── Manejo de errores ─────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status    = err.statusCode || 500;
    const errorType = status >= 500 ? 'Error del servidor' : 'Error del cliente';
    res.status(status).json({
        error:  err.message,
        status: errorType
    });
});

module.exports = app;