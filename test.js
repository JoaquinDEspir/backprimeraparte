const express = require('express');
const app = express();

app.use(express.json());

// Ruta POST de prueba
app.post('/api/sessions/register', (req, res) => {
    console.log('POST /register received');
    res.json({ message: 'Ruta /register alcanzada correctamente' });
});

// Ruta GET simple para probar si el servidor responde correctamente
app.get('/test', (req, res) => {
    res.json({ message: 'GET /test working' });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
