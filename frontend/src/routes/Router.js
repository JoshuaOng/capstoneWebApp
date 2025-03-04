import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './pages/Menu';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';

const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Menu} />
                <Route path="/shopping-cart" component={ShoppingCart} />
                <Route path="/checkout" component={Checkout} />
            </Switch>
        </Router>
    );
};

export default AppRouter;