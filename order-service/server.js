// order-service/server.js
const express = require('express');
const axios = require('axios'); // We use axios to make API calls to other services
const app = express();
const PORT = 3002; // This service will run on port 3002

// A simple, fake database of orders
const orders = {
  '101': { userId: '1', product: 'Laptop', quantity: 1 },
  '102': { userId: '2', product: 'Mouse', quantity: 2 }
};

// The API endpoint to get an order by its ID
app.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const order = orders[orderId];

  if (order) {
    try {
      // Here, the Order Service calls the User Service to get user details
      const userResponse = await axios.get(`http://user-service:3001/users/${order.userId}`);
      
      // Combine the order data with the user data
      const orderDetails = {
        ...order,
        userName: userResponse.data.name,
        userEmail: userResponse.data.email
      };
      
      res.json(orderDetails);
    } catch (error) {
      res.status(500).send('Error fetching user data');
    }
  } else {
    res.status(404).send('Order not found');
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});