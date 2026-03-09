const Sale    = require('../models/sale');
const Cart    = require('../models/cart');
const Product = require('../models/product');

// GET /sales — solo admin
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('userId', 'username email')
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /sales/mySales — cliente loggeado
exports.getSalesByUser = async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user._id })
            .populate('items.productId', 'name price')
            .select('-__v');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /sales/add — confirmar compra
exports.addSales = async (req, res) => {
    try {
        // 1. Obtener el carrito del usuario
        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        // 2. Verificar stock de cada producto
        for (const item of cart.items) {
            const product = item.productId;
            if (product.stock < item.qty) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${product.name}`
                });
            }
        }

        // 3. Crear la venta
        const items = cart.items.map(item => ({
            productId: item.productId._id,
            qty:       item.qty,
            unitPrice: item.price
        }));

        const sale = await Sale.create({
            userId: req.user._id,
            items
        });

        // 4. Descontar stock de cada producto
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.qty }
            });
        }

        // 5. Vaciar el carrito
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};