import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import '../styles/Header.css'; // Import CSS

const Header = () => {
    return (
        <nav>
            <h1>My Website</h1>
            <ul className="nav-links">
                <li><a href="/home">Home</a></li>
                <li><a href="/checkout">Checkout</a></li>
            </ul>
            <div className="cart">
                <a href="/shopping-cart">
                    <FaShoppingCart className="cart-icon" /> Shopping Cart
                </a>
            </div>
        </nav>
    );
};

export default Header;
