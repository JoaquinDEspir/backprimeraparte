const request = require('supertest');
const { app, httpServer } = require('../index');
const ProductRepository = require('../repositories/productRepository');

let productId;
let server;

beforeAll(async () => {
    server = httpServer.listen(0);

    // Limpiar la base de datos antes de las pruebas
    const productsBefore = await ProductRepository.getAllProducts();
    console.log('Productos antes de limpiar:', productsBefore);

    for (const product of productsBefore) {
        console.log('Eliminando producto con ID:', product._id);
        await ProductRepository.deleteProductById(product._id);
    }

    const productsAfter = await ProductRepository.getAllProducts();
    console.log('Productos después de limpiar la base de datos:', productsAfter);
}, 15000);

afterAll(() => {
    server.close();
    console.log('Finalizando pruebas de productos');
});

describe('Products Router Tests', () => {
    it('POST /api/products - Should create a new product', async () => {
        const productRes = await request(app)
            .post('/api/products')
            .send({
                title: 'Test Product',
                description: 'This is a test product',
                code: 'test001',
                price: 150,
                stock: 20,
                category: 'Test Category',
                thumbnails: ['https://example.com/test-product.jpg']
            });

        console.log('Respuesta al crear producto de prueba:', productRes.body);
        expect(productRes.status).toBe(201);
        expect(productRes.body).toHaveProperty('_id');
        productId = productRes.body._id;
    }, 15000);

    it('GET /api/products - Should return a list of products', async () => {
        const res = await request(app).get('/api/products');
        console.log('Respuesta al obtener productos:', res.body);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('payload');
        expect(res.body.payload).toBeInstanceOf(Array);
        expect(res.body.payload.length).toBeGreaterThan(0);
    });

    it('DELETE /api/products/:id - Should delete the product by ID', async () => {
        const res = await request(app).delete(`/api/products/${productId}`);
        console.log('Respuesta al eliminar producto:', res.body, 'Status:', res.status);

        expect(res.status).toBe(200);
        const remainingProducts = await ProductRepository.getAllProducts();
        console.log('Productos restantes después de eliminar:', remainingProducts);
        expect(remainingProducts.find(product => product._id.toString() === productId)).toBeUndefined();
    });
});
