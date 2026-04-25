const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq-service';
const QUEUE_NAME = 'order_created';
let amqpChannel = null; // Keep a channel open

// ** NEW FUNCTION TO HANDLE RETRIES **
async function connectWithRetry() {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    for (let i = 0; i < maxRetries; i++) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            console.log('Order Service connected to RabbitMQ successfully.');
            return channel;
        } catch (error) {
            console.log(`Order Service failed to connect to RabbitMQ (attempt ${i + 1}/${maxRetries}). Retrying...`);
            await new Promise(res => setTimeout(res, retryDelay));
        }
    }
    throw new Error('Order Service could not connect to RabbitMQ after multiple retries.');
}

// In-memory "database"
const orders = {};
let orderCounter = 1;

app.post('/orders', async (req, res) => {
    if (!amqpChannel) {
        return res.status(503).json({ message: "Service not ready, please try again later." });
    }

    const { userId, product, quantity } = req.body;
    const orderId = orderCounter++;
    const newOrder = { orderId, userId, product, quantity, status: 'pending' };
    orders[orderId] = newOrder;

    try {
        const message = JSON.stringify(newOrder);
        amqpChannel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
        console.log(`[x] Sent order ${orderId} to queue`);
    } catch (error) {
        console.error("Error publishing message", error);
        // Handle potential channel closure
    }

    res.status(201).json({ message: "Order received!", order: newOrder });
});

// Start the server only after connecting to RabbitMQ
async function startServer() {
    try {
        amqpChannel = await connectWithRetry();
        app.listen(3002, () => {
            console.log('Order Service running on port 3002');
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startServer();