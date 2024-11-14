// utils/tokenUtils.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = {
    generateToken,
    verifyToken,
};
