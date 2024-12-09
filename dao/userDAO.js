// daos/userDAO.js
const User = require('../models/User');

class UserDAO {
    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

     
}

module.exports = new UserDAO();
