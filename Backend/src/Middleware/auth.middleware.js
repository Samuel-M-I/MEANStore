const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password -email');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } 
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// middlewares/roleMiddleware.js
const authorizenRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.usuario?.role; // Asumiendo que req.usuario existe del auth middleware
        
        if (!userRole) {
            return res.status(401).json({ message: 'No autenticado' });
        }
        
        // Verificar si el rol está permitido
        if (allowedRoles.includes(userRole)) {
            return next(); // Usuario autorizado, continuar
        }
        
        // Usuario no autorizado
        return res.status(403).json({ 
            message: 'Acceso denegado. No tienes permisos suficientes.' 
        });
    };
};

module.exports = { protect, authorizenRoles };