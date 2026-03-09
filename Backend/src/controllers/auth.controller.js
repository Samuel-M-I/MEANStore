const User = require('../models/user');
const jwt  = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const newUser = await User.create({ username, email, password });

        res.status(201).json({
            id:       newUser._id,
            username: newUser.username,
            email:    newUser.email,
            token:    generateToken(newUser._id, newUser.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.json({
            id:       user._id,
            username: user.username,
            role:     user.role,
            token:    generateToken(user._id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};