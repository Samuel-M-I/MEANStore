const mongoose = require('mongoose');
const AppError = require('../utils/appError');

exports.validateDataBase = (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new AppError('El servicio no está disponible. Error de conexión con la base de datos', 503);
        }
        next();
    } catch (error) {
        next(error);
    }
};