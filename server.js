const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database fittizio in memoria
let store = {
    user: { credits: 100 },
    products: [
        { id: 1, name: "Tastiera Meccanica", price: 50, stock: 5 },
        { id: 2, name: "Mouse Gaming", price: 30, stock: 10 }
    ]
};

// 1. GET Catalogo e Saldo
app.get('/api/data', (req, res) => res.json(store));

// 2. POST Acquisto (Logica lato server richiesta!)
app.post('/api/buy', (req, res) => {
    const { productId } = req.body;
    const product = store.products.find(p => p.id === productId);

    if (!product) return res.status(404).json({ error: "Prodotto non trovato" });
    if (product.stock <= 0) return res.status(400).json({ error: "Stock esaurito" });
    if (store.user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti" });

    // Transazione
    store.user.credits -= product.price;
    product.stock -= 1;
    res.json({ message: "Acquisto completato!", store });
});

// 3. POST Admin: Aggiungi Crediti
app.post('/api/admin/credits', (req, res) => {
    store.user.credits += req.body.amount;
    res.json(store);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pronto sulla porta ${PORT}`));