const jwt      = require('jsonwebtoken');
const User     = require('../models/user');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new AppError('No estás autorizado, no se proporcionó un token', 401);
        }

        const decoded     = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id).select('-password');

        if (!currentUser) {
            throw new AppError('El usuario perteneciente a este token ya no existe', 401);
        }
        if (!currentUser.active) {
            throw new AppError('Tu cuenta ha sido desactivada', 401);
        }

        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Token inválido. Por favor inicia sesión de nuevo', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Tu sesión ha expirado. Por favor inicia sesión de nuevo', 401));
        }
        next(error);
    }
};

exports.authorizenRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError('Acceso denegado: rol insuficiente', 403));
    }
    next();
};