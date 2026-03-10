const express = require('express');
const cors = require('cors');
const app = express();

// --- CONFIGURAZIONE MIDDLEWARE (MOLTO IMPORTANTE) ---
// 1. Abilita CORS per permettere a GitHub Pages di comunicare con Render
app.use(cors()); 

// 2. Permette al server di leggere i dati JSON inviati dal Frontend
app.use(express.json());

// --- DATABASE IN MEMORIA (Simulato) ---
let store = {
    user: { credits: 100 },
    products: [
        { id: 1, name: "Tastiera Meccanica", price: 50, stock: 5 },
        { id: 2, name: "Mouse Gaming", price: 30, stock: 2 },
        { id: 3, name: "Monitor 24 pollici", price: 150, stock: 0 }
    ]
};

let nextId = 4;

// --- ROTTE API ---

// Rotta di test per la "Home" (quella che apri nel browser su Render)
app.get('/', (req, res) => {
    res.send("<h1>Il Server E-Commerce è ONLINE!</h1><p>Vai su <b>/api/data</b> per vedere i prodotti.</p>");
});

// 1. Ottieni tutti i dati (Catalogo e Crediti)
app.get('/api/data', (req, res) => {
    res.json(store);
});

// 2. Utente: Compra un prodotto (Logica lato server)
app.post('/api/buy', (req, res) => {
    const { productId } = req.body;
    const product = store.products.find(p => p.id === productId);

    if (!product) return res.status(404).json({ error: "Prodotto non trovato." });
    if (product.stock <= 0) return res.status(400).json({ error: "Prodotto esaurito." });
    if (store.user.credits < product.price) return res.status(400).json({ error: "Crediti insufficienti." });

    // Esegui transazione
    store.user.credits -= product.price;
    product.stock -= 1;
    
    res.json({ message: `Acquisto di ${product.name} completato!`, store });
});

// 3. Admin: Aggiungi Crediti Bonus
app.post('/api/admin/credits', (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Importo non valido." });
    
    store.user.credits += parseInt(amount);
    res.json({ message: "Crediti aggiunti con successo!", store });
});

// 4. Admin: Aggiungi Nuovo Prodotto
app.post('/api/admin/products', (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || price < 0 || stock < 0) return res.status(400).json({ error: "Dati non validi." });

    const newProduct = { id: nextId++, name, price: parseInt(price), stock: parseInt(stock) };
    store.products.push(newProduct);
    res.json({ message: "Prodotto aggiunto al catalogo!", store });
});

// 5. Admin: Aggiorna Stock
app.put('/api/admin/products/:id/stock', (req, res) => {
    const productId = parseInt(req.params.id);
    const { newStock } = req.body;
    
    const product = store.products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: "Prodotto non trovato." });
    
    product.stock = parseInt(newStock);
    res.json({ message: "Stock aggiornato!", store });
});

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server pronto sulla porta ${PORT}`);
});