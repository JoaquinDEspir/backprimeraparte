const express = require('express');
const Product = require('../models/products');
const router = express.Router();

module.exports = (io) => {
    // Listar todos los productos
    router.get('/', async (req, res) => {
        const { sort, query } = req.query;
        const filter = {};

        if (query) {
            filter.$or = [
                { category: query },
                { status: query === 'available' ? true : false }
            ];
        }

        let sortOption = {};
        if (sort) {
            sortOption = sort === 'asc' ? { price: 1 } : { price: -1 };
        }

        try {
            const products = await Product.find(filter).sort(sortOption);
            res.json({
                status: 'success',
                payload: products
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ status: 'error', error: error.message });
        }
    });

    // Crear nuevo producto
    router.post('/', async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            io.emit('updateProducts', await Product.find());
            res.status(201).json(newProduct);
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    });

    // Eliminar producto por ID
    router.delete('/:pid', async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.pid);
            io.emit('updateProducts', await Product.find());
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ status: 'error', message: err.message });
        }
    });

    return router;
};
