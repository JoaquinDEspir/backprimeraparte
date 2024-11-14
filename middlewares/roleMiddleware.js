// middlewares/roleMiddleware.js
function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ message: 'No autorizado' });
        }
    };
}

module.exports = roleMiddleware;
