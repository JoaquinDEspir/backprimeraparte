// routes/mocks.router.js
const express = require('express');
const bcrypt = require('bcrypt');
const faker = require('@faker-js/faker').faker;
const UserRepository = require('../repositories/userRepository');

const router = express.Router();

// Generar usuarios ficticios
function generateMockUsers(quantity) {
    const users = [];
    for (let i = 0; i < quantity; i++) {
        const password = bcrypt.hashSync('coder123', 10);
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 65 }),
            password,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: [],
        });
    }
    return users;
}

// GET /mockingusers - Generar 50 usuarios ficticios
router.get('/mockingusers', async (req, res) => {
    try {
        const users = generateMockUsers(50);
        res.json({ message: 'Usuarios generados con éxito', users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /generateData - Generar y guardar usuarios
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0 } = req.body;
        if (users <= 0) return res.status(400).json({ message: 'Debe indicar un número válido de usuarios a generar.' });

        const mockUsers = generateMockUsers(users);
        await UserRepository.insertMany(mockUsers);

        res.status(201).json({ message: `${users} usuarios generados e insertados en la base de datos con éxito.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
