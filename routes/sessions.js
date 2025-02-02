const express = require('express');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository');
const UserDTO = require('../dtos/userDTO');
const tokenUtils = require('../utils/tokenUtils');
const passport = require('passport');

const router = express.Router();

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserRepository.createUser({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        console.log('Usuario creado:', newUser);

        res.status(201).json({ message: 'Usuario registrado con éxito', user: new UserDTO(newUser) });
    } catch (err) {
        console.error('Error en el registro:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserRepository.getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        // Eliminado el chequeo de contraseña
        console.log('Usuario encontrado:', user);

        const token = tokenUtils.generateToken({ id: user._id, role: user.role });

        res.cookie('jwt', token, { httpOnly: true, secure: false });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtener el usuario autenticado actual
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       401:
 *         description: No autorizado
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

module.exports = router;
