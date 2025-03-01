// server/index.js
require('dotenv').config();  // if you're loading .env for local dev
const express = require('express');
const cors = require('cors');
// ... other imports like custom middlewares or logging

const paymentRoutes = require('./routes/paymentRoutes');  // <-- import your paymentRoutes

const app = express();

// Middleware setup (JSON parsing, CORS, etc.)
app.use(express.json());
app.use(cors());
// ... any other middlewares

// Register the payment routes under /api/payment
app.use('/api/payment', paymentRoutes);

// Example root route (optional)
app.get('/', (req, res) => {
  res.send('Welcome to AI Flowchart Generator API');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
