import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import ShoppingCart from '../pages/shoppingCart';
import Checkout from '../pages/checkout';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/shopping-cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
