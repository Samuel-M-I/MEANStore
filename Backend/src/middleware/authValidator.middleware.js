/**
 * validateRegister
 * Valida todos los campos del formulario de registro antes
 * de llegar al controller. Verifica que username, email y
 * password cumplan con el formato y longitud requeridos.
 * Además consulta la BD para verificar que el email y el
 * username no estén ya en uso.
 *
 * validateLogin
 * Valida que username y password estén presentes y que
 * password cumpla con la longitud mínima requerida.
 * No consulta la BD — eso lo hace el controller.
 */
const User     = require('../models/user');
const AppError = require('../utils/appError');

exports.validateRegister = async (req, res, next) => {
    const { username, email, password } = req.body || {};
    try {
        if (!username)             
            throw new AppError('El nombre de usuario es obligatorio', 400);
        if (username.length < 3)   
            throw new AppError('El nombre debe tener al menos 3 caracteres', 400);
        if (username.length > 20)  
            throw new AppError('El nombre no puede tener más de 20 caracteres', 400);
        if (!email)                
            throw new AppError('El correo es obligatorio', 400);
        if (!/^\S+@\S+\.\S+$/.test(email)) 
            throw new AppError('El correo no es válido', 400);
        if (!password)             
            throw new AppError('La contraseña es obligatoria', 400);
        if (password.length < 6)   
            throw new AppError('La contraseña debe tener al menos 6 caracteres', 400);
        const existsEmail = await User.findOne({ email });
        if (existsEmail)     
            throw new AppError('El correo ya está registrado', 400);
        const existsUsername = await User.findOne({ username });
        if (existsUsername)  
            throw new AppError('El nombre de usuario ya está en uso', 400);

        next();
    } catch (error) {

        next(error);
    }
};

exports.validateLogin = (req, res, next) => {
    const { username, password } = req.body || {};
    try {
        if (!username)           
            throw new AppError('El nombre de usuario es obligatorio', 400);
        if (!password)           
            throw new AppError('La contraseña es obligatoria', 400);
        if (password.length < 6) 
            throw new AppError('La contraseña debe tener al menos 6 caracteres', 400);

        next();
    } catch (error) {
        
        next(error);
    }
};