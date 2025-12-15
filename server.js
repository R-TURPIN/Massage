const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Sert les fichiers statiques (images, css, etc.)
app.use(express.static(__dirname));

// Route de test API
app.get('/api/status', (req, res) => {
    res.json({ 
        message: "✅ SUCCÈS : Le Backend Node.js répond bien !", 
        time: new Date().toLocaleTimeString() 
    });
});

// Route principale qui renvoie le HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
