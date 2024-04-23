import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import Support from './Support';
import AuthContainer from './AuthContainer';
import DarkMode from './DarkMode';


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    let navigate = useNavigate();
    const [popupMessage, setPopupMessage] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5004/cart?userId=${userId}`);
            const data = response.data;
            setCartItems(data);
            const total = data.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        try {
            await axios.put(`http://localhost:5004/cart/${itemId}`, { quantity: newQuantity, user_Id: userId });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleIncrementQuantity = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
        handleUpdateQuantity(itemId, updatedItems.find(item => item.id === itemId).quantity);
    };

    const handleDecrementQuantity = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId && item.quantity > 1) { // Ensure quantity doesn't go below 1
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
        handleUpdateQuantity(itemId, updatedItems.find(item => item.id === itemId).quantity);
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5004/cart?itemId=${itemId}`, { data: { userId } });
            fetchCartItems();
            setPopupMessage('Removed from the cart!');
            setTimeout(() => {
                setPopupMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleEmptyCart = async () => {
        try {
            await axios.delete(`http://localhost:5004/emptycart?userId=${userId}`);
            fetchCartItems();
            setPopupMessage('Cart emptied successfully!');
            setTimeout(() => {
                setPopupMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error emptying cart:', error);
            console.log(error);
        }
    };

    const handleNavigate = async () => {
        handleEmptyCart();
        navigate("/order");
    }

    const handleHome = async () => {
        navigate(-1);
    }

    return (
        <>
            <div className="cart">
                <h2>Shopping Cart</h2>
                {cartItems.length === 0 && <p>Nothing in the cart</p>} {/* Display message when cart is empty */}
                {cartItems.length > 0 && (
                    <>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id} className="item-details">
                                    <div >
                                        <img src={`/${item.product_name}.jpg`} alt={item.product_name} />
                                    </div>
                                    <div className="item-description">
                                        <div className="item-name">{item.product_name}</div>
                                        <div className="item-categories">Category: {item.category}</div>
                                        <div className="item-price">Price: {item.product_price}</div>
                                        <div className="item-brand">Brand: {item.product_brand}</div>
                                    </div>
                                    <div className="quantity-controls" >
                                        <button className="quantity-button" onClick={() => handleDecrementQuantity(item.id, item.quantity)} disabled={item.quantity === 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="quantity-button" onClick={() => handleIncrementQuantity(item.id)}>+</button>
                                        <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            Total Price: ${totalPrice.toFixed(2)}
                        </div>
                        <div className='button-container'>
                            <button className="order-botton" onClick={handleNavigate}> Place Order</button>
                            <button className="empty-cart" onClick={handleEmptyCart}>Empty Cart</button>
                        </div>
                    </>
                )}
            </div>
            {popupMessage && <div className="popup-message">{popupMessage}</div>}
            <Support />
            <AuthContainer />
            <DarkMode />
            <button className="home-botton" onClick={handleHome}>Add More Items</button>
        </>
    );
}

export default Cart;
