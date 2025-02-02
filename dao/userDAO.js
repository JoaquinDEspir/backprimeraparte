const User = require('../models/User');

module.exports = {
    async findByEmail(email) {
        return await User.findOne({ email });
    },

    async createUser(userData) {
        return await new User(userData).save();
    },

    async insertMany(users) {
        return await User.insertMany(users);
    },

    async getAllUsers() {
        return await User.find();
    },

    // Método para borrar todos los usuarios
    async deleteAllUsers() {
        return await User.deleteMany({});
    },
};
