const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payment');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// Routes
app.use('/api/payment', paymentRoutes);

// Test endpoint
app.get('/api', (req, res) => {
  res.send('Backend is running!');
});


