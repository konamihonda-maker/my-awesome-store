const mysql = require('mysql2/promise');

async function setup() {
  console.log("🔵 Connecting to TiDB Cloud...");

  const connection = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    user: '3WXU7rYT6YrGtCk.root', //
    password: 'f1H7UzCK2VG9uEDK', //
    database: 'test',
    port: 4000,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

  console.log("✅ Connected! Creating tables...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      image_url VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      total_amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      quantity INT,
      price DECIMAL(10, 2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`,
    `INSERT IGNORE INTO users (username, password) VALUES ('admin', 'password123')`
  ];

  for (const query of queries) {
    await connection.execute(query);
  }

  console.log("🎉 Tables Created Successfully!");
  console.log("🚀 You are ready to deploy to Render.");
  process.exit();
}

setup().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});