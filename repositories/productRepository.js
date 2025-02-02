const productDAO = require('../dao/productDAO');

class ProductRepository {
    async getProductById(productId) {
        return await productDAO.findById(productId);
    }

    async getAllProducts() {
        return await productDAO.findAll();
    }

    async updateProduct(productId, updateData) {
        return await productDAO.updateProduct(productId, updateData);
    }

    async save(product) {
        return await productDAO.save(product);
    }

    async deleteProduct(productId) {
        return await productDAO.delete(productId);
    }

    async deleteProductById(productId) {
        return await productDAO.deleteProductById(productId);
    }

    async createProduct(productData) {
        return await productDAO.create(productData);  // Nuevo método para creación
    }
}

module.exports = new ProductRepository();
