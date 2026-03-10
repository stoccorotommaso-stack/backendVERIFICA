const express = require('express');
const app = express();

// FORZA IL CORS MANUALMENTE - SENZA LIBRERIE ESTERNE
app.use((req, res, next) => {
    // Log di controllo: vedrai questo nel log di Render
    console.log(`Richiesta ricevuta: ${req.method} da ${req.headers.origin}`);
    
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// DATABASE IN MEMORIA
let store = {
    user: { credits: 100 },
    products: [
        { id: 1, name: "Tastiera", price: 50, stock: 5 },
        { id: 2, name: "Mouse", price: 30, stock: 2 }
    ]
};
let nextId = 3;

// ROTTE
app.get('/', (req, res) => res.send("SERVER ATTIVO - CORS MANUALE"));

app.get('/api/data', (req, res) => res.json(store));

app.post('/api/buy', (req, res) => {
    const { productId } = req.body;
    const product = store.products.find(p => p.id === productId);
    if (!product || product.stock <= 0 || store.user.credits < product.price) {
        return res.status(400).json({ error: "Transazione negata" });
    }
    store.user.credits -= product.price;
    product.stock -= 1;
    res.json({ message: "Acquisto ok", store });
});

app.post('/api/admin/credits', (req, res) => {
    store.user.credits += 50;
    res.json(store);
});

app.post('/api/admin/products', (req, res) => {
    const { name, price, stock } = req.body;
    store.products.push({ id: nextId++, name, price: parseInt(price), stock: parseInt(stock) });
    res.json(store);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend in esecuzione sulla porta ${PORT}`));