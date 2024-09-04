const express = require('express');
const Cart = require('../models/carts');
const Product = require('../models/products');
const router = express.Router();

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
});

// Actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        const productInCart = cart.products.find(item => item.product.toString() === pid);
        if (productInCart) {
            productInCart.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        cart.products = [];
        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
});

// Obtener productos del carrito con populate
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
});

module.exports = router;
    