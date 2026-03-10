# E-Commerce TechStore - Progetto Architetture Distribuite

Sistema E-commerce distribuito composto da un **Backend Node.js** e un **Frontend Vanilla JS**, progettato per gestire transazioni sincronizzate tra utenti e magazzino.

## 1. Architettura del Sistema
Il progetto adotta un'architettura di tipo **Thin Client**. 
* **Client (Frontend):** Sviluppato in puro HTML/CSS/JS, agisce solo come interfaccia di visualizzazione. Non contiene logica decisionale; ogni azione (click su acquisto, aggiunta crediti) genera una richiesta asincrona verso il server.
* **Server (Backend):** Centralizza tutta la logica di business. Gestisce lo stato globale (crediti e stock) e valida ogni richiesta prima di confermare le transazioni.



[Image of client-server architecture diagram]


## 2. Endpoint API (REST)
Il backend espone le seguenti rotte su protocollo HTTP:

| Metodo | Endpoint | Descrizione |
| :--- | :--- | :--- |
| **GET** | `/api/data` | Recupera lo stato globale (User Credits + Catalog) |
| **POST** | `/api/buy` | Elabora l'acquisto (decrementa stock e crediti) |
| **POST** | `/api/admin/credits` | Aggiunge crediti bonus all'utente |
| **POST** | `/api/admin/products` | Inserisce un nuovo prodotto nel catalogo |

## 3. Sicurezza e Controlli Lato Server
La sicurezza dell'integrità dei dati è garantita da controlli preventivi sul server nell'endpoint `/api/buy`:
1. **Validazione Saldo:** Verifica che `user.credits >= product.price`.
2. **Validazione Stock:** Verifica che `product.stock > 0`.
3. **Integrità:** Se uno dei controlli fallisce, il server risponde con `Status 400` e interrompe la transazione, impedendo saldi negativi o stock incoerenti.

## 4. Risoluzione Problematiche (CORS)
Per permettere la comunicazione tra domini differenti (GitHub Pages e Render), è stato implementato un **middleware manuale per il CORS**. Questo inserisce negli header di risposta i parametri `Access-Control-Allow-Origin: *`, autorizzando esplicitamente il browser a ricevere i dati JSON dal backend distribuito.

## 5. Strumenti Utilizzati
* **IA:** Utilizzata per la generazione del CSS strutturale e per il debug degli header CORS durante la fase di deploy.
* **Backend:** Node.js con framework Express.
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Hosting:** Render (Back), GitHub Pages (Front).

---
**Link Server:** `https://tuo-link.onrender.com`  
**Link Frontend:** `https://tuo-utente.github.io/tuo-repo/`