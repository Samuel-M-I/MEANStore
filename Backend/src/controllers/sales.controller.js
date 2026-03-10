const Sale     = require('../models/sale');
const Cart     = require('../models/cart');
const Product  = require('../models/product');
const AppError = require('../utils/appError');

/**
 * GET /sales
 * Retorna todas las ventas del sistema con paginación.
 * Incluye datos del usuario que compró y los productos de cada venta.
 * Soporta ?page= y ?limit= para controlar la paginación.
 * Solo accesible por admin.
 */
exports.getSales = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const total = await Sale.countDocuments();
        const sales = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .select('-__v')
            .skip(skip)
            .limit(limit);

        res.json({ total, page, limit, totalPages: Math.ceil(total / limit), sales });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

/**
 * GET /sales/mySales
 * Retorna el historial de compras del usuario autenticado.
 * Filtra por req.user._id para mostrar solo sus propias ventas.
 * Incluye los datos de los productos comprados.
 */
exports.getSalesByUser = async (req, res, next) => {
    try {
        const sales = await Sale.find({ userId: req.user._id })
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

/**
 * POST /sales/add
 * Confirma la compra del carrito del usuario autenticado.
 * El proceso completo es:
 * 1. Obtiene el carrito con los productos populados
 * 2. Verifica que el carrito no esté vacío
 * 3. Verifica que haya stock suficiente para cada item
 * 4. Mapea los items del carrito al formato de la venta
 * 5. Calcula el total sumando qty * price de cada item
 * 6. Crea el registro de la venta en la BD
 * 7. Descuenta el stock de cada producto vendido
 * 8. Vacía el carrito del usuario
 */
exports.addSales = async (req, res, next) => {
    try {
        // 1. Obtener el carrito con los datos completos de cada producto
        const userCart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!userCart || userCart.items.length === 0) {
            return next(new AppError('El carrito está vacío', 400));
        }

        // 2. Verificar que hay stock suficiente antes de procesar la compra
        for (const item of userCart.items) {
            const foundProduct = item.productId;
            if (foundProduct.stock < item.qty) {
                return next(new AppError(`Stock insuficiente para ${foundProduct.name}`, 400));
            }
        }

        // 3. Convertir los items del carrito al formato que espera el modelo Sale
        const items = userCart.items.map(item => ({
            productId: item.productId._id,
            qty:       item.qty,
            unitPrice: item.price
        }));

        // 4. Calcular el total de la venta (qty * precio de cada item)
        const total = userCart.items.reduce((sum, item) => {
            return sum + (item.qty * item.price);
        }, 0);

        // 5. Registrar la venta con el total ya calculado
        const newSale = await Sale.create({ userId: req.user._id, items, total });

        // 6. Restar las unidades vendidas del stock de cada producto
        for (const item of userCart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.qty }
            });
        }

        // 7. Limpiar el carrito para dejarlo listo para la próxima compra
        userCart.items = [];
        await userCart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};