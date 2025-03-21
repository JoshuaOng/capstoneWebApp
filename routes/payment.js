const express = require('express');
const router = express.Router();
// const stripe = require('stripe')('sk_test_51QJnma08yS02cjemGFJ27o2K6rNlk2OcuAz17xLA3nlwB5N3d0HL7McwLrFx911KPjD5vvc5F3Hm5X7kAlSWvNcY008DFvVyPR');
const stripe = require('stripe')('sk_test_51QztLCQ1fayfJvU18pcD9ev1EcFYJuBipLHynCzuPUzYG1weEthyL3X5HLhBkR4VJCHpIdhaYQ9XeFBEJ1HwMD0900t0Bbi6ZM');//prof acc


// Create a PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {enabled: true}
      });
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;
  