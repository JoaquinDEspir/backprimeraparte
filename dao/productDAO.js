const Product = require('../models/products');

class ProductDAO {
    async findById(productId) {
        return await Product.findById(productId);
    }

    async findAll() {
        return await Product.find();
    }

    async updateProduct(productId, updateData) {
        return await Product.findByIdAndUpdate(productId, updateData, { new: true });
    }

    async save(product) {
        return await product.save();
    }

    async delete(productId) {
        return await Product.findByIdAndDelete(productId);
    }

    async deleteProductById(productId) {
        return await Product.findByIdAndDelete(productId);
    }

    async create(productData) {
        return await Product.create(productData);  // Nuevo método de creación
    }
}

module.exports = new ProductDAO();
