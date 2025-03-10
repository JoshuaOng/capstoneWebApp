import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  const cartItems = location.state?.cart || []; // Get cart items from location state
  const totalBill = location.state?.totalBill || 0; // Get totalBill or default to 0

  // GST & Service Charge
  const gst = (totalBill * 0.09).toFixed(2); // 9% GST
  const serviceCharge = (totalBill * 0.10).toFixed(2); // 10% Service Charge
  const grandTotal = (parseFloat(totalBill) + parseFloat(gst) + parseFloat(serviceCharge)).toFixed(2);

  // Create the PaymentRequest when stripe is available
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'SG',
        currency: 'sgd',
        total: {
          label: 'Demo total',
          amount: Math.round(grandTotal * 100), // Convert to cents
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
          amount: Math.round(grandTotal * 100), // Convert to cents
          currency: 'sgd',
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .then(console.log("successfully fetched secret"))
        .catch((error) => console.error('Error fetching clientSecret:', error));
    }
  }, [stripe, totalBill]);

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
    // Listen to the paymentmethod event
    paymentRequest.on('paymentmethod', async (ev) => {
      console.log('Payment method received:', ev.paymentMethod);

      // Confirm the payment with your backend
      const { error } = await stripe.confirmCardPayment(
        clientSecret, {
        payment_method: ev.paymentMethod.id,
      }
      );

      if (error) {
        console.error('Payment confirmation error:', error);
        ev.complete('fail'); // Notify the UI that the payment failed
      } else {

        console.log('Payment successful!');
        ev.complete('success'); // Notify the UI that the payment succeeded
        // Optionally redirect or show success message
      }
    }
    );
    return (
        // <div>
        //     <Header />
        //     <p>Checkout</p>
        //     <p>Total Cost: ${totalBill}</p>
        //     <PaymentRequestButtonElement options={{ paymentRequest }} />
        // </div>
        <div className="checkout-container">
        <Header />
        <h1 className="checkout-title">Order Summary</h1>
  
        {/* Receipt Section */}
        <div className="receipt">
          <h2>Receipt</h2>
          <div className="receipt-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="receipt-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No items in cart</p>
            )}
          </div>
          <hr />
          <div className="receipt-total">
            <div><strong>Subtotal:</strong> <span>${totalBill}</span></div>
            <div><strong>GST (9%):</strong> <span>${gst}</span></div>
            <div><strong>Service Charge (10%):</strong> <span>${serviceCharge}</span></div>
            <hr />
            <div className="receipt-grand-total"><strong>Grand Total:</strong> <span>${grandTotal}</span></div>
          </div>
        </div>
  
        {/* Payment Button */}
        {paymentRequest ? (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        ) : (
          <button className="confirm-payment-btn" onClick={onConfirm}>Confirm Payment</button>
        )}
      </div>
    )
  }

  // Fallback to a traditional button if the PaymentRequestButton isn't available
  return (
    <div id="checkout-page">
        <Header />
        <p>Checkout</p>
        <p>Total Cost: ${totalBill}</p>
        <button onClick={onConfirm}>Confirm Payment</button>
    </div>
  );
};

export default Checkout;
