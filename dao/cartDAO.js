// dao/cartDAO.js
const Cart = require('../models/carts');

class CartDAO {
    async findById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async updateCart(cartId, updateData) {
        return await Cart.findByIdAndUpdate(cartId, updateData, { new: true });
    }

    async save(cart) {
        return await cart.save();
    }
}

module.exports = new CartDAO();
