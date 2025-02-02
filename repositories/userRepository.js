    const userDAO = require('../dao/userDAO');

    class UserRepository {
        async getUserByEmail(email) {
            return await userDAO.findByEmail(email);
        }

        async createUser(userData) {
            return await userDAO.createUser(userData);
        }

        async insertMany(users) {
            return await userDAO.insertMany(users);
        }

        async getAllUsers() {
            return await userDAO.getAllUsers();
        }

        // Nuevo método para borrar todos los usuarios
        async deleteAllUsers() {
            return await userDAO.deleteAllUsers();
        }
    }

    module.exports = new UserRepository();
