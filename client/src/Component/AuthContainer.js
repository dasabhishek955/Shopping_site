import React, { useState, useRef } from 'react';
import Signup from './Signup';
import Login from './Login';
import './AuthContainer.css';
import Welcome from './Welcome';


const AuthContainer = ({ }) => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const userId = localStorage.getItem('userId');

    const handleSignupClick = () => {
        setShowSignup(true);
        setShowLogin(false);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowSignup(false);
    };

    const handleCancel = () => {
        setShowSignup(false);
        setShowLogin(false);
    };

    return (
        <div className="signup-login">
            {userId ? (
                <Welcome />
            ) : (
                <div className="auth-buttons">
                    {!showSignup && !showLogin && (
                        <>
                            <button onClick={handleSignupClick}>Sign Up</button>
                            <button onClick={handleLoginClick}>Login</button>
                        </>
                    )}
                </div>
            )}
            {showSignup && <Signup onCancel={handleCancel} />}
            {showLogin && <Login onCancel={handleCancel} />}
        </div>
    );
};

export default AuthContainer;
