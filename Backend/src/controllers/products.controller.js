const Product  = require('../models/product');
const AppError = require('../utils/appError');

/**
 * GET /products/public
 * Retorna el catálogo público sin requerir autenticación.
 * Solo muestra productos activos y con stock disponible (stock > 0).
 * Expone únicamente los campos básicos: nombre, precio, stock,
 * categoría e imagen — sin información interna del sistema.
 */
exports.getProductsClient = async (req, res, next) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 }, isActive: true })
            .select('name price stock category imageUrl');

        res.json(products);
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * GET /products/user
 * Retorna el catálogo para clientes autenticados.
 * Solo muestra productos activos y con stock disponible.
 * Incluye descripción, estado (isActive) y nombre del creador.
 * Soporta búsqueda por nombre con ?q= y paginación con ?page= y ?limit=.
 * No expone fechas de creación ni modificación.
 */
exports.getProductsUser = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const query = req.query.q
            ? { name: { $regex: req.query.q, $options: 'i' }, isActive: true, stock: { $gt: 0 } }
            : { isActive: true, stock: { $gt: 0 } };

        const total    = await Product.countDocuments(query);
        const products = await Product.find(query)
            .select('name description price stock category imageUrl isActive createdBy')
            .populate('createdBy', 'username')
            .skip(skip)
            .limit(limit);

        res.json({ total, page, limit, totalPages: Math.ceil(total / limit), products });
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * GET /products
 * Retorna todos los productos del sistema para worker y admin.
 * Incluye productos inactivos y sin stock — vista completa del inventario.
 * Soporta búsqueda por nombre con ?q= y paginación con ?page= y ?limit=.
 * Muestra todos los campos incluyendo fechas y creador.
 */
exports.getProducts = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const query = req.query.q
            ? { name: { $regex: req.query.q, $options: 'i' } }
            : {};

        const total    = await Product.countDocuments(query);
        const products = await Product.find(query)
            .select('-__v')
            .populate('createdBy', 'username')
            .skip(skip)
            .limit(limit);

        res.json({ total, page, limit, totalPages: Math.ceil(total / limit), products });
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * GET /products/:id
 * Retorna el detalle completo de un producto por su ID.
 * Solo accesible por worker y admin.
 * Si el producto no existe retorna 404.
 */
exports.getProductsById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .select('-__v -createdBy -createdAt -updatedAt');
        if (!product)
            return next(new AppError('Producto no encontrado', 404));

        res.json(product);
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * POST /products
 * Crea un nuevo producto en el sistema.
 * Asigna automáticamente isActive: true y el ID del usuario
 * que lo creó (req.user._id) en el campo createdBy.
 * La validación de campos se realiza en el middleware validateProduct.
 */
exports.createProducts = async (req, res, next) => {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;
        const newProduct = await Product.create({
            name, description, price, stock, category, imageUrl,
            isActive:  true,
            createdBy: req.user._id
        });

        res.status(201).json(newProduct);
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * PUT /products/:id
 * Actualiza los datos de un producto existente.
 * Solo actualiza los campos que lleguen en el body —
 * si un campo no se envía, conserva el valor actual.
 * Usa ?? para el stock (permite actualizar a 0 sin perder el valor).
 * La validación se realiza en el middleware validateUpdateProduct.
 */
exports.updateProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return next(new AppError('Producto no encontrado', 404));
        const { name, description, price, stock, category, imageUrl } = req.body;
        product.name        = name        || product.name;
        product.description = description || product.description;
        product.price       = price       || product.price;
        product.stock       = stock       ?? product.stock;
        product.category    = category    || product.category;
        product.imageUrl    = imageUrl    || product.imageUrl;
        await product.save();

        res.json(product);
    } catch (error) {

        next(new AppError(error.message, 500));
    }
};

/**
 * DELETE /products/:id
 * Realiza un soft-delete del producto — no lo elimina de la BD.
 * Cambia isActive a false para ocultarlo del catálogo público y de clientes.
 * El producto sigue existiendo en la BD para mantener el historial de ventas.
 */

exports.toggleActive = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return next(new AppError('Producto no encontrado', 404));
        product.isActive = !product.isActive;
        await product.save();

        res.json({ message: 'Producto desactivado', product });
    } catch (error) {
        
        next(new AppError(error.message, 500));
    }
};