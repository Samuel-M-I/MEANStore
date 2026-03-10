const Cart     = require('../models/cart');
const Product  = require('../models/product');
const AppError = require('../utils/appError');

// GET /cart
exports.getCart = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id })
            .populate('items.productId', 'name price imageUrl');
        res.status(200).json(userCart);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// POST /cart/:id
exports.addToCart = async (req, res, next) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        if (!foundProduct) {
            return next(new AppError('Producto no encontrado', 404));
        }

        const userCart = await Cart.findOne({ userId: req.user._id });

        // Verificar si el producto ya está en el carrito
        const itemExists = userCart.items.find(
            i => i.productId.toString() === req.params.id
        );
        if (itemExists) {
            return next(new AppError('El producto ya está en el carrito', 400));
        }

        userCart.items.push({
            productId: foundProduct._id,
            qty:       req.body.qty || 1,
            price:     foundProduct.price
        });
        await userCart.save();
        res.status(200).json({ message: 'Producto agregado', cart: userCart });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// PUT /cart/:id
exports.updateCart = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id });

        const item = userCart.items.find(
            i => i.productId.toString() === req.params.id
        );
        if (!item) {
            return next(new AppError('Producto no encontrado en el carrito', 404));
        }

        item.qty = req.body.qty;
        await userCart.save();
        res.status(200).json({ message: 'Carrito actualizado', cart: userCart });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

// DELETE /cart/:id
exports.remove = async (req, res, next) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id });

        userCart.items = userCart.items.filter(
            i => i.productId.toString() !== req.params.id
        );
        await userCart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart: userCart });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};