// routes/sessions.js
const express = require('express');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');
const UserDTO = require('../dtos/userDTO');
const tokenUtils = require('../utils/tokenUtils');
const emailService = require('../services/emailService');
const passport = require('passport');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear el nuevo usuario
        const newUser = await UserRepository.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        // Enviar correo de bienvenida
        await emailService.sendEmail(email, 'Bienvenido', 'Gracias por registrarte en nuestra plataforma.');

        res.status(201).json({ message: 'Usuario registrado con éxito', user: new UserDTO(newUser) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por su correo
        const user = await UserRepository.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        // Verificar la contraseña
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        // Generar un token JWT
        const token = tokenUtils.generateToken({ id: user._id, role: user.role });

        // Guardar el token en una cookie
        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta protegida para obtener la información del usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Utilizar DTO para devolver solo la información necesaria
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

module.exports = router;
