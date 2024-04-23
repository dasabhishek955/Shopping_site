import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Order.css';
import Support from './Support';
import axios from 'axios';


const Order = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState("");
    const handleNavigate = () => {
        navigate(-1);
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`http://localhost:5004/user?user_id=${userId}`);
                    setUser(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <>
            <div className='order-massage'>
                Thanks for Ordering  {user.name}
            </div>
            <div>
                <button type="button" className="Home-bottom" onClick={handleNavigate}>
                    Continue Shopping
                </button>
            </div>
            <Support />
        </>
    )
}

export default Order
