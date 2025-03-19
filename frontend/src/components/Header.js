import React, { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/cartContext';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
    const { cart } = useContext(CartContext);

    return (
        <nav className="header">
            <h1>The Best of The West</h1>
            <ul className="nav-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/checkout">Checkout</Link></li>
            </ul>
            <div className="cart">
                <Link to="/shopping-cart">
                    <FaShoppingCart className="cart-icon" />
                    <span className="cart-count">{cart.length}</span> 
                </Link>
            </div>
        </nav>
    );
};

export default Header;
