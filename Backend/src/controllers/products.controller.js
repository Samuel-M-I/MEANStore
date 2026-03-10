const Product  = require('../models/product');
const AppError = require('../utils/appError');

exports.getProductsClient = async (req, res, next) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 }, isActive: true })
            .select('name price stock category imageUrl');
        res.json(products);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

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

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

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

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.getProductsById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .select('-__v -createdBy -createdAt -updatedAt');
        if (!product) {
            return next(new AppError('Producto no encontrado', 404));
        }
        res.json(product);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

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

exports.updateProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError('Producto no encontrado', 404));
        }
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

exports.deleteProducts = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError('Producto no encontrado', 404));
        }
        product.isActive = false;
        await product.save();
        res.json({ message: 'Producto desactivado', product });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};