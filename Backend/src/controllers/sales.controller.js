const Sale     = require('../models/sale');
const Cart     = require('../models/cart');
const Product  = require('../models/product');
const AppError = require('../utils/appError');

exports.getSales = async (req, res, next) => {
    try {
        const sales = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

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

exports.addSales = async (req, res, next) => {
    try {
        // 1. Obtener el carrito
        const userCart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!userCart || userCart.items.length === 0) {
            return next(new AppError('El carrito está vacío', 400));
        }

        // 2. Verificar stock
        for (const item of userCart.items) {
            const foundProduct = item.productId;
            if (foundProduct.stock < item.qty) {
                return next(new AppError(`Stock insuficiente para ${foundProduct.name}`, 400));
            }
        }

        // 3. Mapear items
        const items = userCart.items.map(item => ({
            productId: item.productId._id,
            qty:       item.qty,
            unitPrice: item.price
        }));

        // 4. Calcular total
        const total = userCart.items.reduce((sum, item) => {
            return sum + (item.qty * item.price);
        }, 0);

        // 5. Crear la venta con el total calculado
        const newSale = await Sale.create({ 
            userId: req.user._id, 
            items,
            total
        });

        // 6. Descontar stock
        for (const item of userCart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.qty }
            });
        }

        // 7. Vaciar carrito
        userCart.items = [];
        await userCart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};