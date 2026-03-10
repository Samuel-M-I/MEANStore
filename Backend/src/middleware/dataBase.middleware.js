/**
 * validateDataBase
 * Verifica que la conexión con MongoDB esté activa antes
 * de procesar cualquier request. Mongoose usa readyState
 * para indicar el estado de la conexión:
 * 0 = desconectado, 1 = conectado, 2 = conectando, 3 = desconectando.
 * Si no está en estado 1 retorna 503 — servicio no disponible.
 * Se aplica como primer middleware en todas las rutas.
 */
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

exports.validateDataBase = (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1)
            throw new AppError('El servicio no está disponible. Error de conexión con la base de datos', 503);

        next();
    } catch (error) {
        
        next(error);
    }
};