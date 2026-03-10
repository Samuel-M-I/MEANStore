const User     = require('../models/user');
const Cart     = require('../models/cart');
const jwt      = require('jsonwebtoken');
const AppError = require('../utils/appError');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = await User.create({ username, email, password });

        // Crear carrito vacío automáticamente al registrarse
        await Cart.create({ userId: newUser._id, items: [] });

        res.status(201).json({
            id:       newUser._id,
            username: newUser.username,
            email:    newUser.email,
            token:    generateToken(newUser._id, newUser.role)
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return next(new AppError('Credenciales inválidas', 401));

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return next(new AppError('Credenciales inválidas', 401));

        // Crear carrito si por alguna razón no existe
        const cartExists = await Cart.findOne({ userId: user._id });
        if (!cartExists) {
            await Cart.create({ userId: user._id, items: [] });
        }

        res.json({
            id:       user._id,
            username: user.username,
            role:     user.role,
            token:    generateToken(user._id, user.role)
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.promoteAdmin = async (req, res, next) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username });
        if (!user) return next(new AppError('Usuario no encontrado', 404));
        if (user.role === 'admin') return next(new AppError('El usuario ya es administrador', 400));

        user.role = 'admin';
        await user.save();

        res.json({
            message: `El usuario ${user.username} ahora es administrador`,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};