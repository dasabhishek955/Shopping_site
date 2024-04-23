import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import Login from './Login';

const Signup = ({ onCancel }) => {
    const [popupMessage, setPopupMessage] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        profilePic: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePicPreview(URL.createObjectURL(file));
        } else {
            setProfilePic(null);
            setProfilePicPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('profilePic', profilePic);

        try {
            const response = await axios.post('http://localhost:5004/signup', formDataToSend);
            const { user_id } = response.data;
            localStorage.setItem('userId', user_id);
            window.location.reload();
            setFormData({
                name: '',
                phoneNumber: '',
                email: '',
                password: '',
                profilePic: null
            });
        } catch (error) {
            console.error('Error signing up:', error.response.data);
            setTimeout(() => {
                setPopupMessage('');
            }, 3000);
        }
    };

    const handleLoginClick = () => {
        setShowLoginForm(true);
    };

    const handleCancel = () => {
        setShowLoginForm(false);
    };


    return (
        <>
            {showLoginForm ? (
                <Login onCancel={handleCancel} />
            ) : (
                <>
                    <div className="signup-container">
                        <div className="signup-form">
                            <h2>Sign Up</h2>
                            <form onSubmit={handleSubmit} className="signup-form">
                                <div className="profile-picture-container">
                                    <label htmlFor="profilePic" className="profile-pic-label">
                                        <img
                                            src={profilePicPreview || 'placeholder.png'}
                                            alt="Profile Picture"
                                            className="profile-pic-preview"
                                        />
                                    </label>
                                    <input
                                        type="file"
                                        id="profilePic"
                                        name="profilePic"
                                        accept="image/*"
                                        className="profile-pic-input"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number:</label>
                                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address:</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                                </div>
                                <div className="button-container">
                                    <button className='signup-button' type="submit">Sign Up</button>
                                    <button className='cancel-button' type="button" onClick={onCancel}>Cancel</button>
                                </div>
                                <p>Already have a account?
                                    <button className='login-button' type="button" onClick={handleLoginClick}>Sign in</button>
                                </p>
                            </form>
                        </div>
                    </div>
                    <div>
                        {popupMessage && <div className="popup-message">{popupMessage}</div>}
                    </div>
                </>
            )}
        </>
    );
};

export default Signup;
