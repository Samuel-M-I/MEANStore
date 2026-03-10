/**
 * validateAddToCart
 * Valida todo lo necesario antes de agregar un producto al carrito:
 * - Que el producto exista en la BD
 * - Que el producto esté activo (isActive: true)
 * - Que el producto tenga stock disponible
 * - Que qty sea un número entero mayor a 0
 * - Que qty no supere el stock disponible del producto
 * - Que el producto no esté ya en el carrito del usuario
 *
 * validateUpdateCart
 * Valida todo lo necesario antes de actualizar la cantidad
 * de un producto ya existente en el carrito:
 * - Que qty esté presente y sea un número entero mayor a 0
 * - Que el producto exista y esté activo
 * - Que la nueva cantidad no supere el stock disponible
 */
const Product  = require('../models/product');
const Cart     = require('../models/cart');
const AppError = require('../utils/appError');

exports.validateAddToCart = async (req, res, next) => {
    try {
        const { qty } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) 
            throw new AppError('Producto no encontrado', 404);
        if (!product.isActive) 
            throw new AppError('Este producto no está disponible', 400);
        if (product.stock === 0) 
            throw new AppError('Producto sin stock disponible', 400);
        if (qty !== undefined && (!Number.isInteger(qty) || qty < 1))
            throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
        const cantidad = qty || 1;
        if (cantidad > product.stock)
            throw new AppError(`Solo hay ${product.stock} unidades disponibles`, 400);
        const userCart = await Cart.findOne({ userId: req.user._id });
        if (userCart) {
            const itemExists = userCart.items.find(
                i => i.productId.toString() === req.params.id
            );
            if (itemExists)
                throw new AppError('El producto ya está en el carrito', 400);
        }

        next();
    } catch (error) {

        next(error);
    }
};

exports.validateUpdateCart = async (req, res, next) => {
    try {
        const { qty } = req.body;
        if (qty === undefined) 
            throw new AppError('La cantidad es obligatoria', 400);
        if (!Number.isInteger(qty) || qty < 1) 
            throw new AppError('La cantidad debe ser un número entero mayor a 0', 400);
        const product = await Product.findById(req.params.id);
        if (!product) 
            throw new AppError('Producto no encontrado', 404);
        if (!product.isActive)
            throw new AppError('Este producto ya no está disponible', 400);
        if (qty > product.stock) 
            throw new AppError(`Solo hay ${product.stock} unidades disponibles`, 400);

        next();
    } catch (error) {

        next(error);
    }
};