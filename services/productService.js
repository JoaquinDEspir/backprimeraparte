// services/productService.js
const ProductRepository = require('../repositories/productRepository');

class ProductService {
    async createProduct(data) {
        const newProduct = await ProductRepository.save(data);
        return newProduct;
    }

    async updateProduct(productId, updateData) {
        return await ProductRepository.updateProduct(productId, updateData);
    }

    async deleteProduct(productId) {
        return await ProductRepository.deleteProduct(productId);
    }
}

module.exports = new ProductService();
