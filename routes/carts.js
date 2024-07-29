const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const cartsFilePath = './data/carts.json';

const readCartsFile = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

const writeCartsFile = (data) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
};

router.post('/', (req, res) => {
    const carts = readCartsFile();
    const newCart = {
        id: uuidv4(),
        products: []
    };
    carts.push(newCart);
    writeCartsFile(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Cart not found');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        writeCartsFile(carts);
        res.status(201).json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

module.exports = router;
