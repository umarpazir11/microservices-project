// user-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();
// The new, better line
const PORT = process.env.PORT || 3001; // Use the env variable, or 3001 as a default

// A simple, fake database of users
const users = {
  '1': { name: 'John Doe', email: 'john.doe@example.com' },
  '2': { name: 'Jane Smith', email: 'jane.smith@example.com' }
};

// The API endpoint to get a user by their ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users[userId];

  if (user) {
    res.json(user); // If user is found, send their data back
  } else {
    res.status(404).send('User not found'); // Otherwise, send a 404 error
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});