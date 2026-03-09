const User     = require('../models/user');
const AppError = require('../utils/appError');

exports.getUsers = async (req, res, next) => {
    try {
        const usuarios = await User.find()
            .select('-password -__v -createdAt -updatedAt');
        res.json(usuarios);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.changeUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new AppError('Usuario no encontrado', 404));
        }
        user.role = req.body.role;
        await user.save();
        res.json({ message: 'Rol actualizado', user });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};

exports.toggleActive = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(new AppError('Usuario no encontrado', 404));
        }
        user.active = !user.active;
        await user.save();
        res.json({ message: `Usuario ${user.active ? 'activado' : 'desactivado'}`, user });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};