const AppError = require('../utils/appError');

exports.validateAdminSecret = (req, res, next) => {
    try {
        const secretKey = req.headers['x-admin-secret'];

        if (!secretKey) {
            throw new AppError('Se requiere la clave secreta de administrador', 401);
        }
        if (secretKey !== process.env.ADMIN_SECRET_KEY) {
            throw new AppError('Clave secreta incorrecta', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};