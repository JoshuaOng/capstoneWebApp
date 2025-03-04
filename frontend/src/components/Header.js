import React, { useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cartUiActions } from '../../store/shopping-cart/cartUiSlice';
import './Header.css'; // Assuming you have some CSS for styling

const navLinks = [
    { display: 'Menu', path: '/menu' },
    { display: 'Shopping Cart', path: '/shopping-cart' },
    { display: 'Checkout', path: '/checkout' },
];

const Header = () => {
    const menuRef = useRef(null);
    const headerRef = useRef(null);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => menuRef.current.classList.toggle('show__menu');
    const toggleCart = () => dispatch(cartUiActions.toggle());

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                headerRef.current.classList.add('header__shrink');
            } else {
                headerRef.current.classList.remove('header__shrink');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="header" ref={headerRef}>
            <div className="nav__wrapper d-flex align-items-center justify-content-between">
                <div className="logo" onClick={() => navigate('/menu')}>
                    <h5>My App</h5>
                </div>
                <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                    <div className="menu d-flex align-items-center gap-5" onClick={(e) => e.stopPropagation()}>
                        {navLinks.map((item, index) => (
                            <NavLink
                                to={item.path}
                                key={index}
                                className={(navClass) => (navClass.isActive ? 'active__menu' : '')}
                                onClick={toggleMenu}
                            >
                                {item.display}
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="nav__right d-flex align-items-center gap-4">
                    <span className="cart__icon" onClick={toggleCart}>
                        <i className="ri-shopping-basket-line"></i>
                        <span className="cart__badge">{totalQuantity}</span>
                    </span>
                    <span className="mobile__menu" onClick={toggleMenu}>
                        <i className="ri-menu-line"></i>
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;