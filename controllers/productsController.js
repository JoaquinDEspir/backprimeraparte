// controllers/ProductController.js
const ProductService = require('../services/productService');

class ProductController {
    async createProduct(req, res) {
        try {
            const productData = req.body;
            const product = await ProductService.createProduct(productData);
            res.status(201).json({ message: 'Producto creado exitosamente', product });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el producto', error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const updateData = req.body;
            const product = await ProductService.updateProduct(productId, updateData);
            res.status(200).json({ message: 'Producto actualizado exitosamente', product });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            await ProductService.deleteProduct(productId);
            res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
        }
    }
}

module.exports = new ProductController();
