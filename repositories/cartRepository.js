const cartDAO = require('../dao/cartDAO');

class CartRepository {
    async getCartById(cartId) {
        return await cartDAO.findById(cartId);
    }

    async updateCart(cartId, updateData) {
        return await cartDAO.updateCart(cartId, updateData);
    }

    async save(cart) {
        return await cartDAO.save(cart);
    }

    async deleteCart(cartId) {
        return await cartDAO.deleteCart(cartId);
    }
    async save(cartData) {
        return await cartDAO.save(cartData);
    }

    async getAllCarts() {
        return await cartDAO.getAllCarts();
    }
}

module.exports = new CartRepository();
