const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

module.exports = function(io) {
    const router = express.Router();
    const productsFilePath = './data/products.json';

    const readProductsFile = () => {
        const data = fs.readFileSync(productsFilePath);
        return JSON.parse(data);
    };

    const writeProductsFile = (data) => {
        fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
    };

    router.get('/', (req, res) => {
        const products = readProductsFile();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    });

    router.get('/:pid', (req, res) => {
        const products = readProductsFile();
        const product = products.find(p => p.id === req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    });

    router.post('/', (req, res) => {
        const products = readProductsFile();
        const newProduct = {
            id: uuidv4(),
            ...req.body,
            status: req.body.status || true
        };
        products.push(newProduct);
        writeProductsFile(products);
        io.emit('updateProducts', products); // Emitir evento a través de socket.io
        res.status(201).json(newProduct);
    });

    router.put('/:pid', (req, res) => {
        const products = readProductsFile();
        const productIndex = products.findIndex(p => p.id === req.params.pid);
        if (productIndex !== -1) {
            const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
            products[productIndex] = updatedProduct;
            writeProductsFile(products);
            io.emit('updateProducts', products); // Emitir evento a través de socket.io
            res.json(updatedProduct);
        } else {
            res.status(404).send('Product not found');
        }
    });

    router.delete('/:pid', (req, res) => {
        let products = readProductsFile();
        products = products.filter(p => p.id !== req.params.pid);
        writeProductsFile(products);
        io.emit('updateProducts', products); // Emitir evento a través de socket.io
        res.status(204).send();
    });

    return router;
};
