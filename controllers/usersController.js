// controllers/sessionsController.js
// Asegúrate de que esta línea esté presente
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const { generateToken } = require('../utils/tokenUtils');

// Registro de usuario
async function registerUser(req, res) {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const existingUser = await userDAO.findByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await userDAO.createUser({ first_name, last_name, email, age, password: hashedPassword });
        await emailService.sendWelcomeEmail(newUser.email);

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Inicio de sesión de usuario
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userDAO.findByEmail(email);
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = generateToken({ id: user._id, role: user.role });
        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Exportación de funciones del controlador
module.exports = { registerUser, loginUser };
