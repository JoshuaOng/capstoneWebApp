import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/menuItem.css';

const MenuItem = ({ id, name, description, price, image }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="menu-card">
            <img src={image} alt={name} className="menu-image" />
            <div className="menu-content">
                <h3 className="menu-title">{name}</h3>
                <p className="menu-description">{description}</p>
                <p className="menu-price">${price.toFixed(2)}</p>
                <button className="menu-button" onClick={() => addToCart({ id, name, price, image })}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MenuItem;
