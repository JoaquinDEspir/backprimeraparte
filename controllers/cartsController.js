// controllers/CartController.js
const CartService = require('../services/cartService');
const cartRepository = require('../repositories/cartRepository');

class CartController {
    async purchaseCart(req, res) {
        try {
            const cartId = req.params.cid;
            const userEmail = req.user.email;

            const result = await CartService.purchase(cartId, userEmail);

            if (result.unavailableProducts && result.unavailableProducts.length > 0) {
                res.status(200).json({
                    message: 'Compra completada parcialmente',
                    ticket: result.ticket,
                    unavailableProducts: result.unavailableProducts
                });
            } else {
                res.status(200).json({ message: 'Compra completada exitosamente', ticket: result.ticket });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al realizar la compra', error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            const cart = await cartRepository.getCartById(req.params.cid);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.body.productId;
            const quantity = req.body.quantity || 1;

            const cart = await cartRepository.getCartById(cartId);
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cartRepository.save(cart);
            res.status(200).json({ message: 'Producto añadido al carrito', cart });
        } catch (error) {
            res.status(500).json({ message: 'Error al añadir el producto al carrito', error: error.message });
        }
    }
}

module.exports = new CartController();
