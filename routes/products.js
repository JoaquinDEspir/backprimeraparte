const express = require('express');
const Product = require('../models/products');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error al crear el producto
 */
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        console.log('Producto creado:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ status: 'error', message: 'Error al crear producto' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        console.log('Producto eliminado con ID:', id);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
});

module.exports = router;
