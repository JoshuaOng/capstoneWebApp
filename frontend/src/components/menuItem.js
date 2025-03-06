import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MenuItem = ({ id, name, description, price, image }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = () => {
        addToCart({ id, name, price });
        toast.success(`${name} added to cart!`, { position: "top-right", autoClose: 2000 });
    };

    return (
        <div className="menu-item">
            <img src={image} alt={name} className="menu-item-image" />
            <div className="menu-item-content">
                <h3 className="menu-item-title">{name}</h3>
                <p className="menu-item-description">{description}</p>
                <p className="menu-item-price">${price.toFixed(2)}</p>
                <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>
        </div>
    );
};

export default MenuItem;
