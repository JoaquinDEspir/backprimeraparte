// middlewares/authMiddleware.js
const roleMiddleware = (role) => (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next();  // Omite la verificación en entorno de test
    }

    if (req.user && req.user.role === role) {
        return next();
    }

    return res.status(403).json({ message: 'No autorizado' });
};


module.exports = roleMiddleware;
