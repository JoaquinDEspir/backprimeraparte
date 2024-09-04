const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de Handlebars
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/coder_back', {
    useNewUrlParser: true, // Opcional pero recomendado
    useUnifiedTopology: true, // Opcional pero recomendado
    family: 4 // Esto asegura que Mongoose use IPv4
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('Error connecting to MongoDB', err));

// Rutas de API
app.use('/api/products', productsRouter(io)); // Pasamos io al router
app.use('/api/carts', cartsRouter);

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
    console.log('New client connected');

    socket.on('newProduct', async (productData) => {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (err) {
            console.error('Error al guardar nuevo producto', err);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (err) {
            console.error('Error al eliminar producto', err);
        }
    });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
