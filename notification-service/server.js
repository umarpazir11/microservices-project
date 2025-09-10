const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq-service';
const QUEUE_NAME = 'order_created';

// ** NEW FUNCTION TO HANDLE RETRIES **
async function connectWithRetry() {
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    for (let i = 0; i < maxRetries; i++) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            console.log('Connected to RabbitMQ successfully.');
            return connection;
        } catch (error) {
            console.log(`Failed to connect to RabbitMQ (attempt ${i + 1}/${maxRetries}). Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, retryDelay));
        }
    }
    throw new Error('Could not connect to RabbitMQ after multiple retries.');
}

async function consumeMessages() {
    try {
        const connection = await connectWithRetry(); // Use the new function
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`[*] Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`);

        channel.consume(QUEUE_NAME, (msg) => {
            if (msg !== null) {
                const orderDetails = JSON.parse(msg.content.toString());
                console.log("[x] Received order:", orderDetails);
                console.log(`--> Simulating sending email for order ${orderDetails.orderId}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consumer:', error.message);
        process.exit(1); // Exit if connection fails permanently
    }
}

consumeMessages();