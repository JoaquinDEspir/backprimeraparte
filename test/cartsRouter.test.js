const request = require('supertest');
const { app, httpServer } = require('../index');
const CartRepository = require('../repositories/cartRepository');
const ProductRepository = require('../repositories/productRepository');

let cartId;
let server;

beforeAll(async () => {
    server = httpServer.listen(0);

    console.log('Creando productos para el carrito');

    // Crear productos para el carrito
    const product1 = await ProductRepository.createProduct({
        title: 'Product 1',
        description: 'Description for product 1',
        code: 'prod001',
        price: 100,
        stock: 10,
        category: 'Test Category'
    });

    const product2 = await ProductRepository.createProduct({
        title: 'Product 2',
        description: 'Description for product 2',
        code: 'prod002',
        price: 200,
        stock: 5,
        category: 'Test Category'
    });

    console.log('Productos creados:', product1, product2);

    // Crear un carrito usando datos válidos
    const cart = await CartRepository.save({
        products: [
            { product: product1._id, quantity: 2 },
            { product: product2._id, quantity: 1 }
        ]
    });

    console.log('Carrito creado:', cart);
    cartId = cart._id;
});

afterAll(() => {
    server.close();
    console.log('Finalizando pruebas de carritos');
});

describe('Carts Router Tests', () => {
    it('POST /api/carts/:cid/purchase - Should process a purchase', async () => {
        console.log('Enviando solicitud de compra para el carrito:', cartId);
        const res = await request(app).post(`/api/carts/${cartId}/purchase`).send();

        console.log('Respuesta al procesar la compra:', res.body, 'Status:', res.status);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ticket');
    });
});
