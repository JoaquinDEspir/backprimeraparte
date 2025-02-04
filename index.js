const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Importar rutas y modelos
const mocksRouter = require('./routes/mock');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const sessionsRouter = require('./routes/sessions');
const usersRouter = require('./routes/users');
const Product = require('./models/products');
const swaggerDocs = require('./config/swagger');

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());

// Rutas de API
app.use('/api/mocks', mocksRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
swaggerDocs(app);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Rutas para las vistas
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (err) {
        res.status(500).send('Error al cargar productos');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (err) {
        res.status(500).send('Error al cargar productos');
    }
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
    socket.on('newProduct', async (productData) => {
        const newProduct = new Product(productData);
        await newProduct.save();
        const products = await Product.find();
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', async (productId) => {
        await Product.findByIdAndDelete(productId);
        const products = await Product.find();
        io.emit('updateProducts', products);
    });
});

// Iniciar el servidor solo si no estamos en modo de pruebas
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 8080;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, httpServer };
