const Sale    = require('../models/sale');
const Cart    = require('../models/cart');
const Product = require('../models/product');

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

exports.addSales = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId');

        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        for (const item of userCart.items) {
            const foundProduct = item.productId;
            if (foundProduct.stock < item.qty) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${foundProduct.name}`
                });
            }
        }

        const items = userCart.items.map(item => ({
            productId: item.productId._id,
            qty:       item.qty,
            unitPrice: item.price
        }));

        const newSale = await Sale.create({ userId: req.user._id, items });

        for (const item of userCart.items) {
            await Product.findByIdAndUpdate(item.productId._id, {
                $inc: { stock: -item.qty }
            });
        }

        userCart.items = [];
        await userCart.save();

        res.status(201).json({ message: 'Compra realizada con éxito', sale: newSale });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};