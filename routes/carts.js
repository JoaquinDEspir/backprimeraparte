// routes/carts.js
const express = require('express');
const Cart = require('../models/carts');
const Product = require('../models/products');
const ticketService = require('../services/ticketService');
const roleMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:cid/purchase', roleMiddleware('user'), async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        let totalAmount = 0;
        const unavailableProducts = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save();
            } else {
                unavailableProducts.push(product._id);
            }
        }

        if (totalAmount > 0) {
            const ticket = await ticketService.createTicket({
                amount: totalAmount,
                purchaser: req.user.email
            });

            cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
            await cart.save();

            res.json({ ticket, unavailableProducts });
        } else {
            res.json({ message: 'No se pudo procesar la compra', unavailableProducts });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al procesar la compra', error: err.message });
    }
});

module.exports = router;
