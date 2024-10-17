const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('./config/passport'); // Configuración de Passport para JWT
const cookieParser = require('cookie-parser'); // Para manejar cookies
require('dotenv').config(); // Para manejar variables de entorno

// Importar rutas y modelos
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const sessionsRouter = require('./routes/sessions'); // Rutas para autenticación de usuarios
const Product = require('./models/products'); // Modelo de productos

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

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
app.use(cookieParser()); // Middleware para manejar cookies
app.use(passport.initialize()); // Inicializa Passport

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://joaqueen:BsVTPUhl4rmjutWF@cluster0.uehidpe.mongodb.net/coder_back?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('Error connecting to MongoDB', err));

// Rutas de API
app.use('/api/products', productsRouter(io)); // Pasamos io al router
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter); // Rutas para autenticación

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




// Ruta para obtener el usuario autenticado actual
app.get('/api/sessions/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user); // Devolver los datos del usuario autenticado
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
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
