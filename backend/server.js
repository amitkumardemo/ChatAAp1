const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = 'your_secret_key'; // Change this to a strong secret in production

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

// Initialize SQLite database
const db = new sqlite3.Database('./backend/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT
)`);

// Create orders table if not exists
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  products TEXT,
  total REAL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)`);


// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email and password' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(query, [username, email, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Example protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected profile route', user: req.user });
});

// Create order endpoint
app.post('/api/orders', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { products, total } = req.body;
  if (!products || !total) {
    return res.status(400).json({ message: 'Products and total are required' });
  }
  const query = 'INSERT INTO orders (user_id, products, total) VALUES (?, ?, ?)';
  db.run(query, [userId, JSON.stringify(products), total], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.status(201).json({ message: 'Order created successfully', orderId: this.lastID });
  });
});

// Get all orders (admin)
app.get('/api/orders', authenticateToken, (req, res) => {
  // For simplicity, assume user with id=1 is admin
  if (req.user.id !== 1) {
    return res.status(403).json({ message: 'Access denied' });
  }
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(rows);
  });
});

// Placeholder for payment gateway integration
app.post('/api/payment', authenticateToken, (req, res) => {
  // Implement payment gateway logic here (e.g., Stripe)
  res.json({ message: 'Payment processing not implemented yet' });
});


app.get('/api/products', (req, res) => {
  // Sample product data - in real app, fetch from DB
  const allProducts = [
    {
      id: 1,
      name: 'Sunstar Fresh Melon Juice',
      category: 'Juices',
      price: 18.0,
      rating: 4.5,
      qty: 1,
      image: 'images/thumb-bananas.png',
      discount: 30,
      description: 'Fresh and natural melon juice',
    },
    {
      id: 2,
      name: 'Heinz Tomato Ketchup',
      category: 'Groceries',
      price: 5.0,
      rating: 4.0,
      qty: 1,
      image: 'images/thumb-tomatoketchup.png',
      discount: 15,
      description: 'Classic tomato ketchup',
    },
    // Add more products as needed
  ];

  const category = req.query.category;
  if (category && category !== 'All Categories') {
    const filtered = allProducts.filter(p => p.category === category);
    return res.json(filtered);
  }
  res.json(allProducts);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
