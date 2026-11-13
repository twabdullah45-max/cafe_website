const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000; // Port 5000 use kar rahe hain taake router ka masla na ho

// Middleware
app.use(express.json());
app.use(cors());

// Frontend files serve karne ke liye current folder direct use hoga
app.use(express.static(path.join(__dirname)));

// Database Connection (SQLite)
const db = new sqlite3.Database('./cafe.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Orders Table Create karna
db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT,
    items TEXT,
    total REAL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Order Save karne ki API Route
app.post('/api/orders', (req, res) => {
    const { name, address, items, total } = req.body;
    
    if (!name || !address || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data!' });
    }

    const itemsString = JSON.stringify(items);
    const query = `INSERT INTO orders (name, address, items, total) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [name, address, itemsString, total], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, orderId: this.lastID, message: 'Order placed successfully!' });
    });
});

// Server Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running! Access it at http://localhost:${PORT}`);
});