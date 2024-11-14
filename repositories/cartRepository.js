// repositories/cartRepository.js


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
}

module.exports = new CartRepository();
