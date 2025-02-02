// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación de API con Swagger',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        email: { type: 'string' },
                        age: { type: 'integer' },
                        password: { type: 'string' },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        category: { type: 'string' },
                        stock: { type: 'integer' },
                    },
                },
                UserDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],  // Aquí se cargan los comentarios en las rutas
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
