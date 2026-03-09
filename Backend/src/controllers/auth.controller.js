const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id,roles) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: '1h'});
};



// Registro de un nuevo usuario
exports.register =async(req ,res )=>{
    try{
        const {username, email, password} = req.body;
        (await User.findOne({email})) && res.status(400).json({message: 'El correo ya está registrado'});
        const newUser = await User.create({username, email, password});

        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id, newUser.role)
        });
    } catch(error){
        res.status(500).json({message: 'Error al registrar el usuario', error: error.message});
    } 
};

//Login de un usuario existente

exports.login =async(req,res)=>{
    try{
        const {username, password}=req.body;

        const user = await User.findOne({ username }).select('-password -email');
        !user || !(await user.matchPassword(password)) && res.status(401).json({message: 'Credenciales inválidas'});

        res.json({
            id: user._id,
            username: user.username,
            token: generateToken(user._id, user.roles)
        });

    }catch(error){
        res.status(500).json({message: 'Error al iniciar sesión', error: error.message});   
    }
}