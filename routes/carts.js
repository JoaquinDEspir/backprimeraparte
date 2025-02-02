const express = require('express');
const Cart = require('../models/carts');
const Product = require('../models/products');
const ticketService = require('../services/ticketService');
const roleMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finalizar la compra de un carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente
 *       500:
 *         description: Error al procesar la compra
 */
router.post('/:cid/purchase', roleMiddleware('user'), async (req, res) => {
    try {
        console.log('Iniciando proceso de compra para carrito:', req.params.cid);

        // Buscar el carrito y sus productos
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        console.log('Carrito encontrado:', cart);

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        let totalAmount = 0;
        const unavailableProducts = [];

        // Procesar cada producto en el carrito
        for (const item of cart.products) {
            const product = item.product;
            console.log('Procesando producto:', product);

            if (product.stock >= item.quantity) {
                totalAmount += product.price * item.quantity;
                product.stock -= item.quantity;
                await product.save();
                console.log('Producto actualizado con nuevo stock:', product);
            } else {
                unavailableProducts.push(product._id);
            }
        }

        console.log('Monto total de la compra:', totalAmount);
        console.log('Productos no disponibles:', unavailableProducts);

        // Si hay productos disponibles, crear el ticket
        if (totalAmount > 0) {
            const ticket = await ticketService.createTicket({
                amount: totalAmount,
                purchaser: req.user?.email || 'test@example.com'  // Utilizar un email ficticio si no hay usuario autenticado
            });

            console.log('Ticket generado:', ticket);

            // Eliminar los productos no disponibles del carrito
            cart.products = cart.products.filter(item => unavailableProducts.includes(item.product._id));
            await cart.save();

            return res.json({ ticket, unavailableProducts });
        } else {
            return res.json({ message: 'No se pudo procesar la compra', unavailableProducts });
        }
    } catch (err) {
        console.error('Error al procesar la compra:', err);
        res.status(500).json({ message: 'Error al procesar la compra', error: err.message });
    }
});

module.exports = router;
