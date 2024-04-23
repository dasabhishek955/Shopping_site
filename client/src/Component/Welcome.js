import React, { useState, useEffect } from 'react';
import './Welcome.css';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Welcome = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5004/user?user_id=${userId}`);
                console.log(response.data.name, "AB");
                setUser(response.data.name);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        window.location.reload();
    };

    const handleNavigate = () => {
        navigate("/Favorites");
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="welcome-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <img src={`/${user}.jpg`} alt={user} />
            {isHovered && <div className="dropdown-menu" >
                <nav>
                    <ul>
                        <li onClick={handleNavigate}>
                            <div>Favorites</div>
                        </li>
                        <li onClick={handleLogout}>Logout</li>
                    </ul>
                </nav>
            </div>}
        </div>
    )
}

export default Welcome
