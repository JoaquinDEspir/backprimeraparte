// repositories/productRepository.js


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
}

module.exports = new ProductRepository();
