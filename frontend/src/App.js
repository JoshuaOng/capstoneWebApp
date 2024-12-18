import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';

const App = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  // Create the PaymentRequest when stripe is available
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'SG',
        currency: 'sgd',
        total: {
          label: 'Demo total',
          amount: 50, // Amount in cents
        },
        requestPayerName: false,
        requestPayerEmail: false,
      });

      // Check if the device can make payments
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      // Request clientSecret from your backend server for PaymentIntent
      fetch('https://basic-app-api.azurewebsites.net/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50, // Match the amount and currency used in the PaymentRequest
          currency: 'sgd',
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .then(console.log("successfully fetched secret"))
        .catch((error) => console.error('Error fetching clientSecret:', error));
    }
  }, [stripe]);

  // Handle the confirmation of the payment
  const onConfirm = async () => {
    if (!stripe || !elements || !clientSecret) return; // Ensure Stripe.js and elements are loaded
    console.log("onConfirm called")
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'https://capstonewebapp.azurewebsites.net/order/123/complete', // URL to redirect to after successful payment
      },
    });

    if (error) {
      // Handle payment confirmation error
      console.error('Payment confirmation error:', error);
    } else {
      console.log('Payment confirmed!');
      // Redirect the user to the return_url or show a success message
    }
  };

  // If PaymentRequestButton is available, render it
  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  // Fallback to a traditional button if the PaymentRequestButton isn't available
  return (
    <div id="checkout-page">
      <button onClick={onConfirm}>Confirm Payment</button>
    </div>
  );
};

export default App;
