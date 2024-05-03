const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


const dbPath = path.resolve(__dirname, 'db', 'db.sqlite');
const db = new sqlite3.Database(dbPath);


db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER,
    address TEXT,
    state TEXT,
    biography TEXT
  )`);
});


app.use(express.json());


app.post('/api/users', (req, res) => {
  const { name, age, address, state, biography } = req.body;

  db.run(`INSERT INTO users (name, age, address, state, biography) VALUES (?, ?, ?, ?, ?)`,
    [name, age, address, state, biography], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
  });
});


app.get('/api/users', (req, res) => {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
