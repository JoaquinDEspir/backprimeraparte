// repositories/userRepository.js



class UserRepository {
    async getUserByEmail(email) {
        return await userDAO.findByEmail(email);
    }

    async createUser(userData) {
        return await userDAO.createUser(userData);
    }
    
    
}

module.exports = new UserRepository();
