const Product  = require('../models/product');
const Cart     = require('../models/cart');
const AppError = require('../utils/appError');

exports.validateAddToCart = async (req, res, next) => {
    try {
        const { qty } = req.body;
        const product = await Product.findById(req.params.id);

        // Verificar si el producto existe
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }

        // Verificar si el producto está activo
        if (!product.isActive) {
            throw new AppError('Este producto no está disponible', 400);
        }

        // Verificar si hay stock disponible
        if (product.stock === 0) {
            throw new AppError('Producto sin stock disponible', 400);
        }

        // Verificar que qty sea un número válido
        if (qty !== undefined && (!Number.isInteger(qty) || qty < 1)) {
            throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
        }

        // Verificar que qty no supere el stock disponible
        const cantidad = qty || 1;
        if (cantidad > product.stock) {
            throw new AppError(`Solo hay ${product.stock} unidades disponibles`, 400);
        }

        // Verificar si el producto ya está en el carrito
        const userCart = await Cart.findOne({ userId: req.user._id });
        if (userCart) {
            const itemExists = userCart.items.find(
                i => i.productId.toString() === req.params.id
            );
            if (itemExists) {
                throw new AppError('El producto ya está en el carrito', 400);
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

exports.validateUpdateCart = async (req, res, next) => {
    try {
        const { qty } = req.body;

        // Verificar que qty esté presente
        if (qty === undefined) {
            throw new AppError('La cantidad es obligatoria', 400);
        }

        // Verificar que qty sea válido
        if (!Number.isInteger(qty) || qty < 1) {
            throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
        }

        // Verificar producto existe y está activo
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new AppError('Producto no encontrado', 404);
        }

        if (!product.isActive) {
            throw new AppError('Este producto ya no está disponible', 400);
        }

        // Verificar stock disponible
        if (qty > product.stock) {
            throw new AppError(`Solo hay ${product.stock} unidades disponibles`, 400);
        }

        next();
    } catch (error) {
        next(error);
    }
};