import React, { useContext , useState} from 'react';
import { CartContext } from '../context/cartContext';
import '../styles/shoppingCart.css';
import Header from '../components/Header'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; 

const ShoppingCart = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();

    // Local state to handle the quantity input values
    const [quantityInput, setQuantityInput] = useState({});

    // Handle input change
    const handleQuantityChange = (id, value) => {
        setQuantityInput((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Handle Update button click
    const handleUpdateQuantity = (id) => {
        const newQuantity = quantityInput[id] || 1; // Default to 1 if undefined
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        } else {
            // If quantity is 0 or less, remove the item
            removeFromCart(id);
        }
    };

    // Calculate total bill
    const totalBill = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    // Handle Checkout Click
    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty!", { position: "top-right", autoClose: 2000 });
            return;
        }
        toast.success("Proceeding to checkout!", { position: "top-right", autoClose: 2000 });

        navigate('/checkout', { state: { totalBill } }); // Pass totalBill as state
    };


    return (
        <div>
            <Header />
            <div className="shopping-cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                {cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <h3>{item.name}</h3>
                                <p>${item.price.toFixed(2)} x {item.quantity}</p>
                                <div className="cart-controls">
                                    <input
                                        type="number"
                                        value={quantityInput[item.id] || item.quantity} // Controlled input value
                                        min="1"
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)} // Update state on input change
                                    />
                                    <button className="update-btn" onClick={() => handleUpdateQuantity(item.id)}>Update</button>
                                    <button className="remove-btn"onClick={() => removeFromCart(item.id)}>Remove item</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="cart-summary">
                    <h3>Total: ${totalBill}</h3>
                    <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
            </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
