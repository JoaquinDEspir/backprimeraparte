const express = require('express');
const UserRepository = require('../repositories/userRepository');
const UserDTO = require('../dtos/userDTO');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de todos los usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDTO'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    try {
        const users = await UserRepository.getAll();
        res.json(users.map(user => new UserDTO(user)));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await UserRepository.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(new UserDTO(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *               role:
 *                 type: string
 *                 description: Rol del usuario (user/admin)
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        const newUser = await UserRepository.createUser({ first_name, last_name, email, password, role });
        res.status(201).json(new UserDTO(newUser));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               role:
 *                 type: string
 *                 description: Rol del usuario (user/admin)
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await UserRepository.updateUserById(req.params.id, req.body);
        if (!updatedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(new UserDTO(updatedUser));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const user = await UserRepository.deleteUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
},);
router.delete('/', async (req, res) => {
    try {
        if (process.env.NODE_ENV !== 'test') {
            return res.status(403).json({ message: 'Acción no permitida fuera de entorno de pruebas' });
        }

        await UserRepository.deleteAllUsers();
        res.status(200).json({ message: 'Todos los usuarios han sido eliminados' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar usuarios', error: err.message });
    }
});

module.exports = router;
