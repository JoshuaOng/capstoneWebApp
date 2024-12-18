const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/payment.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello!');
});

// Routes
app.use('/api/payment', paymentRoutes);

// Test endpoint
app.get('/api', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});