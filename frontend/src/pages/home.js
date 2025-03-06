import React from 'react';
import Header from '../components/Header';
import MenuItem from '../components/menuItem';
import '../styles/home.css';

const menuData = [
    { id: 1, name: "Margherita Pizza", description: "Classic cheese pizza with fresh basil.", price: 12.99, image: "https://source.unsplash.com/250x150/?pizza" },
    { id: 2, name: "Cheeseburger", description: "Juicy beef patty with cheese, lettuce & tomato.", price: 10.99, image: "https://source.unsplash.com/250x150/?burger" },
    { id: 3, name: "Pasta Carbonara", description: "Creamy sauce with bacon and parmesan.", price: 14.99, image: "https://source.unsplash.com/250x150/?pasta" },
    { id: 4, name: "Caesar Salad", description: "Crisp romaine, parmesan, and croutons.", price: 8.99, image: "https://source.unsplash.com/250x150/?salad" },
];

const Home = () => {
    return (
        <div>
            <Header />
            <main className="home-container">
                <h1>Welcome to Our Restaurant</h1>
                <p>Explore our delicious menu below:</p>
                <div className="menu-grid">
                    {menuData.map(item => (
                        <MenuItem key={item.id} {...item} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;