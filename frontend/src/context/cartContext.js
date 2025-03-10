import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [totalBill, setTotalBill] = useState(() => {
        return parseFloat(localStorage.getItem("totalBill")) || 0;
    });

    // Function to calculate total bill
    const calculateTotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Update localStorage and total bill whenever cart changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        const newTotal = calculateTotal(cart);
        setTotalBill(newTotal);
        localStorage.setItem("totalBill", newTotal);
    }, [cart]);

    // Add item to cart
    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                toast.success(`${item.name} added to cart!`, { position: "top-right", autoClose: 2000 });
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                toast.success(`${item.name} added to cart!`, { position: "top-right", autoClose: 2000 });
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== id);
            toast.error("Item removed from cart!", { position: "top-right", autoClose: 2000 });
            return updatedCart;
        });
    };

    // Update item quantity
    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) return removeFromCart(id);
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    return (
        <CartContext.Provider value={{ cart, totalBill, addToCart, removeFromCart, updateQuantity, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
