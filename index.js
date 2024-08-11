const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const fs = require('fs');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter(io)); // Pasamos io al router
app.use('/api/carts', cartsRouter);

// Rutas para las vistas
app.get('/', (req, res) => {
    const products = require('./data/products.json'); // Cargar los productos desde el JSON
    res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
    const products = require('./data/products.json'); // Cargar los productos desde el JSON
    res.render('realTimeProducts', { products });
});

// Configurar socket.io
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('newProduct', (product) => {
        const products = require('./data/products.json');
        products.push(product);
        fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        let products = require('./data/products.json');
        products = products.filter(p => p.id !== productId);
        fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
        io.emit('updateProducts', products);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
