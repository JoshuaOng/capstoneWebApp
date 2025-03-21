import React, { useState, useEffect, useContext } from 'react';
import { useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import { CartContext } from '../context/cartContext';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const { cart, calculateTotal, clearCart } = useContext(CartContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  // Load cart from localStorage if needed
  const storedCart = JSON.parse(localStorage.getItem('cart')) || cart;
  const totalBill = calculateTotal(storedCart);

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
      // fetch('https://basic-app-api.azurewebsites.net/api/payment/create-payment-intent', {
      fetch('capstonewebapp-backendapi.azurewebsites.net/api/payment/create-payment-intent', {
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
  }, [stripe, grandTotal]);

  // Send order data to Azure function before confirming payment
  const sendOrderDataToAzure = async () => {
    console.log("sendOrderDataToAzure called");
    try {
      const orderData = {
        orderID: Date.now().toString(), // Use a timestamp as the unique order ID
        tableNumber: 5, // Example: You can dynamically get this if needed
        datetimeOrdered: new Date().toISOString(), // Ensure ISO format for the datetime
        totalAmount: grandTotal, // Grand total calculated in the checkout page
        orders: storedCart.map(item => ({
          foodItem: item.name, // Item name
          quantity: item.quantity, // Quantity of each item
          price: item.price, // Price of each item
        })),
      };

      const response = await fetch('https://producer-function.azurewebsites.net/api/produceOrder?code=negHRZZbS1q8dBQVOAlB3myfmqGBSlSe47aDzTHlnFU0AzFu6aE0EA%3D%3D', { // Replace with your Azure function URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Order successfully sent to Azure:', data);
      } else {
        throw new Error(data.message || 'Failed to send order');
      }
    } catch (error) {
      console.error('Error sending order to Azure:', error);
    }
  };  

  // Handle the confirmation of the payment
  const onConfirm = async () => {
    if (!stripe || !elements || !clientSecret || isProcessing) return;
    setIsProcessing(true); // Disable button to prevent multiple calls  
    console.log("onConfirm called")
    console.log("clientSecret: ", clientSecret)
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'https://delightful-moss-0e300e100.6.azurestaticapps.net/payment-success', // URL to redirect to after successful payment
      },
    });
    setIsProcessing(false); // Re-enable button after response

    if (error) {
      // Handle payment confirmation error
      console.error('Payment confirmation error:', error);
    } else {
      console.log('Payment confirmed1!');
      clearCart();
      // After the payment is confirmed, send the order to Azure
      await sendOrderDataToAzure();

      // Optionally redirect or show success message
      navigate('/payment-success');
      // Redirect the user to the return_url or show a success message
    }
  };

  // If PaymentRequestButton is available, render it
  if (paymentRequest) {
    // Listen to the paymentmethod event
    paymentRequest.on('paymentmethod', async (ev) => {
      console.log("clientSecret: ", clientSecret)
      if (isProcessing) return; // Prevent duplicate payments
      console.log('Payment method received:', ev.paymentMethod);
      setIsProcessing(true);

      // Confirm the payment with your backend
      const { error } = await stripe.confirmCardPayment(
        clientSecret, {
        payment_method: ev.paymentMethod.id,
      }
      );
      setIsProcessing(false); // Re-enable processing after response

      if (error) {
        console.error('Payment confirmation error:', error);
        ev.complete('fail'); // Notify the UI that the payment failed
      } else {
        // After the payment is confirmed, send the order to Azure
        await sendOrderDataToAzure();

        clearCart();

        // Optionally redirect or show success message
        navigate('/payment-success');
        
        console.log('Payment successful!2');
        ev.complete('success'); // Notify the UI that the payment succeeded
      }
    }
    );
    return (
      <div className="checkout-container">
        <Header />
        <h1 className="checkout-title">Order Summary</h1>
  
        {/* Receipt Section */}
        <div className="receipt">
          <h2>Receipt</h2>
          <div className="receipt-items">
            {storedCart.length > 0 ? (
              storedCart.map((item) => (
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
          {/* Receipt Summary */}
          <div className="receipt-summary">
              <div className="receipt-summary-item">
                  <span>Subtotal:</span>
                  <span>${parseFloat(totalBill).toFixed(2)}</span>
              </div>
              <div className="receipt-summary-item">
                  <span>GST (9%):</span>
                  <span>${parseFloat(gst).toFixed(2)}</span>
              </div>
              <div className="receipt-summary-item">
                  <span>Service Charge (10%):</span>
                  <span>${parseFloat(serviceCharge).toFixed(2)}</span>
              </div>
              <div className="receipt-grand-total">
                  <span>Total:</span>
                  <span>${grandTotal}</span>
              </div>
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
    // <div id="checkout-page">
    //     <Header />
    //     <p>Checkout</p>
    //     <p>Total Cost: ${totalBill}</p>
    //     <button onClick={onConfirm}>Confirm Payment</button>
    // </div>
    <div className="checkout-container">
        <Header />
        <h1 className="checkout-title">Order Summary</h1>
  
        {/* Receipt Summary */}
        <div className="receipt-summary">
            <div className="receipt-summary-item">
                <span>Subtotal:</span>
                <span>${parseFloat(totalBill).toFixed(2)}</span>
            </div>
            <div className="receipt-summary-item">
                <span>GST (9%):</span>
                <span>${parseFloat(gst).toFixed(2)}</span>
            </div>
            <div className="receipt-summary-item">
                <span>Service Charge (10%):</span>
                <span>${parseFloat(serviceCharge).toFixed(2)}</span>
            </div>
            <div className="receipt-grand-total">
                <span>Total:</span>
                <span>${grandTotal}</span>
            </div>
        </div>
  
        {/* Payment Button */}
        {paymentRequest ? (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        ) : (
          <button className="confirm-payment-btn" onClick={onConfirm}>Confirm Payment</button>
        )}
      </div>
  );
};

export default Checkout;
