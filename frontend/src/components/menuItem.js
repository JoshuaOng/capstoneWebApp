import React, { useContext } from 'react';
import { CartContext } from '../context/cartContext';
import 'react-toastify/dist/ReactToastify.css';

const MenuItem = ({ id, name, description, price, image }) => {
    const { addToCart } = useContext(CartContext);
    return (
        <div style={styles.card}>
        <img src={image} alt={name} style={styles.image} />
            <div style={styles.content}>
                <h3 style={styles.title}>{name}</h3>
                <p style={styles.description}>{description}</p>
                <p style={styles.price}>${price.toFixed(2)}</p>
                <button onClick={() => addToCart({ id, name, price, image })}>Add to Cart</button>
            </div>
        </div>
    );
};
const styles = {
    card: {
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        textAlign: 'center',
        transition: '0.3s',
        cursor: 'pointer',
        maxWidth: '250px'
    },
    image: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px'
    },
    content: {
        marginTop: '10px'
    },
    title: {
        margin: '10px 0 5px',
        fontSize: '18px'
    },
    description: {
        fontSize: '14px',
        color: '#666'
    },
    price: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#27ae60'
    }
};
    


export default MenuItem;
