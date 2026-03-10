const User    = require('../models/user');
const Product = require('../models/product');
const Sale    = require('../models/sale');
const AppError = require('../utils/appError');

// GET /admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const usuarios = await User.find()
            .select('-password -__v -createdAt -updatedAt');
        res.json(usuarios);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// PUT /admin/users/:userId/role
exports.changeUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return next(new AppError('Usuario no encontrado', 404));
        user.role = req.body.role;
        await user.save();
        res.json({ message: 'Rol actualizado', user });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// PATCH /admin/users/:userId/active
exports.toggleActive = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return next(new AppError('Usuario no encontrado', 404));
        user.active = !user.active;
        await user.save();
        res.json({ message: `Usuario ${user.active ? 'activado' : 'desactivado'}`, user });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.getDashboard = async (req, res, next) => {
    try {
        // ── Fechas ────────────────────────────────
        const hoy        = new Date();
        const inicioDia  = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finDia     = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

        // ── Ventas del día ────────────────────────
        const ventasHoy = await Sale.find({
            date: { $gte: inicioDia, $lt: finDia }
        });

        const totalVentasHoy   = ventasHoy.length;
        const ingresosTotales  = ventasHoy.reduce((sum, sale) => sum + sale.total, 0);

        // ── Últimas 5 ventas ──────────────────────
        const ultimasVentas = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .sort({ date: -1 })
            .limit(5)
            .select('-__v');

        // ── Productos con stock bajo (menos de 5) ─
        const stockBajo = await Product.find({
            stock:    { $lte: 5 },
            isActive: true
        }).select('name stock category');

        // ── Productos sin stock ───────────────────
        const sinStock = await Product.find({
            stock:    0,
            isActive: true
        }).select('name category');

        // ── Totales generales ─────────────────────
        const totalUsuarios  = await User.countDocuments();
        const totalProductos = await Product.countDocuments({ isActive: true });
        const totalVentas    = await Sale.countDocuments();

        res.json({
            resumenGeneral: {
                totalUsuarios,
                totalProductos,
                totalVentas
            },
            ventasDelDia: {
                cantidad:  totalVentasHoy,
                ingresos:  ingresosTotales
            },
            ultimasVentas,
            inventario: {
                stockBajo,
                sinStock
            }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};