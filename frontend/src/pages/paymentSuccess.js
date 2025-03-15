import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/paymentSuccess.css";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    // Simulated order number (could be fetched dynamically)
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been placed successfully.</p>

            <div className="order-details">
                <p><strong>Order Number:</strong> #{orderNumber}</p>
                <p><strong>Table Number:</strong> 12</p>
            </div>

            <p>We are preparing your order and will serve it shortly.</p>

            <button className="home-button" onClick={() => navigate("/")}>
                Return to Home
            </button>
        </div>
    );
};

export default PaymentSuccess;
