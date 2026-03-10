const User     = require('../models/user');
const Product  = require('../models/product');
const Sale     = require('../models/sale');
const AppError = require('../utils/appError');

/**
 * GET /admin/users
 * Retorna la lista de todos los usuarios registrados en el sistema.
 * Oculta campos sensibles como password, __v, createdAt y updatedAt.
 * Solo accesible por admin.
 */
exports.getUsers = async (req, res, next) => {
    try {
        const usuarios = await User.find()
            .select('-password -__v -createdAt -updatedAt');

        res.json(usuarios);
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * PUT /admin/users/:userId/role
 * Cambia el rol de un usuario específico (client, worker, admin).
 * Recibe el nuevo rol en req.body.role.
 * Solo accesible por admin.
 */
exports.changeUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) 
            return next(new AppError('Usuario no encontrado', 404));
        user.role = req.body.role;
        await user.save();

        res.json({ message: 'Rol actualizado', user });
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * PATCH /admin/users/:userId/active
 * Activa o desactiva un usuario según su estado actual.
 * Si estaba activo lo desactiva, y viceversa (toggle).
 * Un usuario desactivado no puede iniciar sesión.
 * Solo accesible por admin.
 */
exports.toggleActive = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) 
            return next(new AppError('Usuario no encontrado', 404));
        user.active = !user.active;
        await user.save();

        res.json({ message: `Usuario ${user.active ? 'activado' : 'desactivado'}`, user });
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * GET /admin/dashboard
 * Retorna las métricas generales del sistema en una sola petición:
 * - Resumen general: total de usuarios, productos activos y ventas
 * - Ventas del día: cantidad de ventas e ingresos del día actual
 * - Últimas 5 ventas: con datos del usuario y productos comprados
 * - Inventario: productos con stock bajo (≤5) y productos sin stock
 * Solo accesible por admin.
 */
exports.getDashboard = async (req, res, next) => {
    try {
        // Rango de fechas para filtrar las ventas del día actual
        const hoy       = new Date();
        const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finDia    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

        // Busca todas las ventas realizadas hoy
        const ventasHoy = await Sale.find({
            date: { $gte: inicioDia, $lt: finDia }
        });

        // Calcula la cantidad de ventas e ingresos totales del día
        const totalVentasHoy  = ventasHoy.length;
        const ingresosTotales = ventasHoy.reduce((sum, sale) => sum + sale.total, 0);

        // Trae las últimas 5 ventas del sistema ordenadas por fecha descendente
        const ultimasVentas = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .sort({ date: -1 })
            .limit(5)
            .select('-__v');

        // Busca productos activos con stock igual o menor a 5 (alerta de reposición)
        const stockBajo = await Product.find({
            stock:    { $lte: 5 },
            isActive: true
        }).select('name stock category');

        // Busca productos activos que ya no tienen unidades disponibles
        const sinStock = await Product.find({
            stock:    0,
            isActive: true
        }).select('name category');

        // Conteos generales del sistema
        const totalUsuarios  = await User.countDocuments();
        const totalProductos = await Product.countDocuments({ isActive: true });
        const totalVentas    = await Sale.countDocuments();

        res.json({
            resumenGeneral: { totalUsuarios, totalProductos, totalVentas },
            ventasDelDia:   { cantidad: totalVentasHoy, ingresos: ingresosTotales },
            ultimasVentas,
            inventario:     { stockBajo, sinStock }
        });
    } catch (error) {
        
        next(new AppError(error.message, 500));
    }
};