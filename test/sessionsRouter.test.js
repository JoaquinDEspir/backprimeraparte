const request = require('supertest');
const { app, httpServer } = require('../index');
const UserRepository = require('../repositories/userRepository');

let token;
let server;

beforeAll(async () => {
    server = httpServer.listen(0);

    // Limpiar la base de datos antes de las pruebas
    await UserRepository.deleteAllUsers();

    // Registrar usuario de prueba
    const registerRes = await request(app)
        .post('/api/sessions/register')
        .send({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            age: 30
        });

    console.log('Register response:', registerRes.body);
    expect(registerRes.status).toBe(201);

    // Iniciar sesión para obtener el token
    const loginRes = await request(app)
        .post('/api/sessions/login')
        .send({
            email: 'johndoe@example.com',
            password: 'password123'
        });

    console.log('Login response:', loginRes.body);
    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;
}, 15000);  // Tiempo aumentado a 15 segundos

afterAll(() => {
    server.close();
});

describe('Sessions Router Tests', () => {
    it('POST /api/sessions/register - Should register a new user', async () => {
        const res = await request(app)
            .post('/api/sessions/register')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janedoe@example.com',
                password: 'password456',
                age: 25
            });

        console.log('Register new user response:', res.body);  // Debug del resultado de registro
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('user');
    });

    it('POST /api/sessions/login - Should log in the user', async () => {
        const res = await request(app)
            .post('/api/sessions/login')
            .send({
                email: 'janedoe@example.com',
                password: 'password456'
            });

        console.log('Login user response:', res.body);  // Debug del resultado de login
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('GET /api/sessions/current - Should get current user details', async () => {
        const res = await request(app)
            .get('/api/sessions/current')
            .set('Authorization', `Bearer ${token}`);

        console.log('Current user details response:', res.body);  // Debug del resultado de detalles de usuario
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', 'johndoe@example.com');
    });
});
