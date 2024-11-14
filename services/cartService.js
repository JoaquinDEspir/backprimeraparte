// services/cartService.js
const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');
const TicketService = require('./ticketService');

class CartService {
    async purchase(cartId, userEmail) {
        const cart = await CartRepository.getCartById(cartId);
        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product._id);
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                product.stock -= item.quantity;
                await ProductRepository.updateProduct(product._id, { stock: product.stock });
            } else {
                unavailableProducts.push(product._id);
            }
        }

        if (totalAmount > 0) {
            const ticket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: userEmail
            });

            cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
            await CartRepository.save(cart);

            return { ticket, unavailableProducts };
        }

        return { message: 'No se pudo procesar la compra', unavailableProducts };
    }
}

module.exports = new CartService();
