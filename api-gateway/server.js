const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// The issue is that Express strips the base path.
// This configuration uses a router to avoid that problem entirely.

app.use(createProxyMiddleware({
    // A placeholder target, the router will override it
    target: 'http://localhost:8080',
    changeOrigin: true,
    router: (req) => {
        if (req.path.startsWith('/users')) {
            return 'http://user-service:3001';
        }
        if (req.path.startsWith('/orders')) {
            return 'http://order-service:3002';
        }
    }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});