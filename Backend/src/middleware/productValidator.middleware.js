const AppError = require('../utils/appError');

exports.validateProduct = (req, res, next) => {
    const { name, description, price, stock, category } = req.body || {};
    try {
        if (!name)                
            throw new AppError('El nombre del producto es obligatorio', 400);
        if (name.length < 3)      
            throw new AppError('El nombre debe tener al menos 3 caracteres', 400);
        if (name.length > 100)    
            throw new AppError('El nombre no puede tener más de 100 caracteres', 400);
        if (description !== undefined && description.length > 500)
            throw new AppError('La descripción no puede tener más de 500 caracteres', 400);
        if (price === undefined)  
            throw new AppError('El precio es obligatorio', 400);
        if (price < 0)            
            throw new AppError('El precio no puede ser negativo', 400);
        if (stock === undefined)  
            throw new AppError('El stock es obligatorio', 400);
        if (stock < 0)            
            throw new AppError('El stock no puede ser negativo', 400);
        if (!Number.isInteger(stock)) 
            throw new AppError('El stock debe ser un número entero', 400);
        if (!category)            
            throw new AppError('La categoría es obligatoria', 400);

        next();
    } catch (error) {
        next(error);
    }
};

exports.validateUpdateProduct = (req, res, next) => {
    const { description, price, stock } = req.body || {};
    try {
        if (description !== undefined && description.length > 500)
            throw new AppError('La descripción no puede tener más de 500 caracteres', 400);
        if (price !== undefined && price < 0)
            throw new AppError('El precio no puede ser negativo', 400);
        if (stock !== undefined && stock < 0)
            throw new AppError('El stock no puede ser negativo', 400);
        if (stock !== undefined && !Number.isInteger(stock))
            throw new AppError('El stock debe ser un número entero', 400);

        next();
    } catch (error) {
        next(error);
    }
};