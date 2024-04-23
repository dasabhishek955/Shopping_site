// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Homepage from './Component/Homepage';
import ProductList from './Component/ProductList';
import Cart from './Component/Cart';
import Order from './Component/Order';
import SupportPage from './Component/SupportPage';
import Favorites from './Component/Favorites';
import Animation from './Component/Animation';
import DarkMode from './Component/DarkMode';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/mobile" element={<ProductList category="Mobile" />} />
          <Route path="/laptop" element={<ProductList category="Laptop" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/Favorites" element={<Favorites />} />
          {/* <Route path="/DarkMode" element={<DarkMode />} /> */}

        </Routes>
        <Animation />
      </div>
    </Router>
  );
}

export default App;
