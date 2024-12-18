const express = require('express');
const router = express.Router();

// Define your payment routes
router.post('/create-payment-intent', (req, res) => {
  // Your payment intent logic
  res.send({ clientSecret: 'your-client-secret' });
});

module.exports = router; // Export the router