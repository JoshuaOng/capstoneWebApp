import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import '../styles/shoppingCart.css';
import Header from '../components/Header'

const ShoppingCart = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

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
                                <p>${item.price.toFixed(2)}</p>
                                <div className="cart-controls">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
