const Cart    = require('../models/cart');
const Product = require('../models/product');

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const userCart = await Cart.findOne({ userId })
            .populate('items.productId')
            .select('-createdAt -updatedAt -__v');
        if (!userCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const foundProduct = await Product.findById(req.params.id);
        const userCart     = await Cart.findOne({ userId: req.user._id });

        if (!foundProduct || !userCart) {
            return res.status(404).json({ message: 'Producto o carrito no encontrado' });
        }

        userCart.items.push({
            productId: foundProduct._id,
            qty:       req.body.qty,
            price:     foundProduct.price
        });
        await userCart.save();
        res.status(200).json({ message: 'Producto agregado', cart: userCart });

    } catch (error) {
        res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id });
        if (!userCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const item = userCart.items.find(i => i.productId.toString() === req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        item.qty = req.body.qty;
        await userCart.save();
        res.status(200).json({ message: 'Carrito actualizado', cart: userCart });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const userCart = await Cart.findOne({ userId: req.user._id });
        if (!userCart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        userCart.items = userCart.items.filter(
            i => i.productId.toString() !== req.params.id
        );
        await userCart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart: userCart });

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: error.message });
    }
};