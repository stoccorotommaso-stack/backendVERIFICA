const express = require('express');
const app = express();

// MIDDLEWARE CORS MANUALE (Più potente della libreria 'cors')
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // Gestione Preflight: Risponde OK alle verifiche preventive del browser
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Database fittizio
let store = {
    user: { credits: 100 },
    products: [
        { id: 1, name: "Tastiera Meccanica", price: 50, stock: 5 },
        { id: 2, name: "Mouse Gaming", price: 30, stock: 2 },
        { id: 3, name: "Monitor 24 pollici", price: 150, stock: 0 }
    ]
};

let nextId = 4;

// Rotte
app.get('/', (req, res) => {
    res.send("<h1>Backend Online e Sbloccato!</h1><p>Versione 2.0 - CORS Manuale Attivo</p>");
});

app.get('/api/data', (req, res) => res.json(store));

app.post('/api/buy', (req, res) => {
    const { productId } = req.body;
    const product = store.products.find(p => p.id === productId);
    if (!product || product.stock <= 0 || store.user.credits < product.price) {
        return res.status(400).json({ error: "Errore: Prodotto esaurito o crediti insufficienti." });
    }
    store.user.credits -= product.price;
    product.stock -= 1;
    res.json({ message: "Acquisto completato!", store });
});

app.post('/api/admin/credits', (req, res) => {
    store.user.credits += parseInt(req.body.amount || 0);
    res.json({ message: "Crediti aggiunti!", store });
});

app.post('/api/admin/products', (req, res) => {
    const { name, price, stock } = req.body;
    const newP = { id: nextId++, name, price: parseInt(price), stock: parseInt(stock) };
    store.products.push(newP);
    res.json({ message: "Prodotto aggiunto!", store });
});

app.put('/api/admin/products/:id/stock', (req, res) => {
    const p = store.products.find(prod => prod.id === parseInt(req.params.id));
    if (p) p.stock = parseInt(req.body.newStock);
    res.json({ message: "Stock aggiornato!", store });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));