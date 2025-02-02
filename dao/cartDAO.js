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

    async deleteCart(cartId) {
        return await Cart.findByIdAndDelete(cartId);
    }
    async save(cartData) {
        // Crear una nueva instancia si no es ya un documento de Mongoose
        const cart = cartData instanceof Cart ? cartData : new Cart(cartData);
        return await cart.save();
    }

    async getAllCarts() {
        return await Cart.find();
    }
}

module.exports = new CartDAO();
