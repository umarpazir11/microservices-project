require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDb() {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully.');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE
            );
        `);

        const res = await client.query('SELECT COUNT(*) FROM users');
        if (res.rows[0].count === '0') {
            await client.query("INSERT INTO users (name, email) VALUES ('John Doe', 'john.doe@example.com'), ('Jane Smith', 'jane.smith@example.com');");
            console.log('Sample users inserted.');
        }
        client.release();
    } catch (err) {
        console.error('Error during database initialization', err.stack);
        // Exit the process if the database can't be initialized
        process.exit(1);
    }
}

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ** THE FIX IS HERE **
// We create a new function to start the server
async function startServer() {
    // First, wait for the database to be ready
    await initializeDb();
    
    // Then, start the Express server
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT} and connected to the database.`);
    });
}

// Call the function to start the server
startServer();