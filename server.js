// server.js - Final Clean Version
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. GET Products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM products');
        const productsWithFullImageUrl = rows.map(product => ({
            ...product,
            image_url: product.image_url && product.image_url.startsWith('/uploads') 
                ? `http://localhost:3000${product.image_url}` 
                : product.image_url
        }));
        res.json(productsWithFullImageUrl);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 2. POST Add Product
app.post('/api/products', upload.single('imageFile'), async (req, res) => {
    const { name, description, price, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result] = await pool.execute(
            'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock, image_url]
        );
        res.status(201).json({ message: "Product added!", productId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error adding product" });
    }
});

// 3. PUT Update Product
app.put('/api/products/:id', upload.single('imageFile'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    let sql, values;
    if (image_url) {
        sql = `UPDATE products SET name=?, description=?, price=?, stock=?, image_url=? WHERE id=?`;
        values = [name, description, price, stock, image_url, id];
    } else {
        sql = `UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?`;
        values = [name, description, price, stock, id];
    }

    try {
        await pool.execute(sql, values);
        res.json({ message: "Product updated!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
});

// 4. DELETE Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

// 🛒 5. CHECKOUT ROUTE (Corrected & Single Definition)
app.post('/api/orders', async (req, res) => {
  const { cartItems, totalAmount } = req.body;
  
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert main order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (total_amount) VALUES (?)',
      [totalAmount]
    );
    const orderId = orderResult.insertId;

    // 2. Process each product in the cart
    for (const product of cartItems) {
      
      // Save item to order_items
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, product.id, product.quantity, product.price]
      );

      // 📉 UPDATE STOCK
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [product.quantity, product.id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully!', orderId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Checkout Error:', error);
    res.status(500).json({ message: 'Failed to place order: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
});

// 📜 6. GET All Orders (History)
app.get('/api/orders/history', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        o.id AS order_id, 
        o.total_amount, 
        o.created_at, 
        oi.product_id, 
        p.name AS product_name, 
        oi.quantity, 
        oi.price
      FROM orders o
      INNER JOIN order_items oi ON o.id = oi.order_id
      INNER JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    // Grouping logic
    const orders = rows.reduce((acc, row) => {
      if (!acc[row.order_id]) {
        acc[row.order_id] = { 
          order_id: row.order_id, 
          total_amount: row.total_amount, 
          created_at: row.created_at, 
          items: [] 
        };
      }
      acc[row.order_id].items.push({
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price
      });
      return acc;
    }, {});

    res.json(Object.values(orders));
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔐 LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Check if user exists with matching password
    // (Note: In a real app, we would use bcrypt to hash passwords!)
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?', 
      [username, password]
    );

    if (rows.length > 0) {
      // Success: User found!
      res.json({ success: true, message: 'Login successful', user: { username } });
    } else {
      // Fail: Wrong username or password
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});