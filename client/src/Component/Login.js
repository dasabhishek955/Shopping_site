// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Signup from './Signup';


const Login = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showSignupForm, setShowSignupForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5004/login', formData);
      console.log('Login successful:', response.data);
      // Reset form fields
      setFormData({
        email: '',
        password: ''
      });

      const { user_id } = response.data;
      localStorage.setItem('userId', user_id);
      window.location.reload();

    } catch (error) {
      console.error('Error logging in:', error.response.data.error);
      console.log(error.response.data.message);
    }
  };

  const handleSignupClick = () => {
    setShowSignupForm(true);
  };

  const handleCancel = () => {
    setShowSignupForm(false);
  };

  return (
    <div>
      {showSignupForm ? (
        <Signup onCancel={handleCancel} />
      ) : (
        <div className="login-container">
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="button-container">
                <button className="login-button" type="submit">Login</button>
                <button className="cancel-button" type="cancel" onClick={onCancel}>Cancel</button>
              </div>
              <p>Don't have an account?
                <button className="signup-button" type="button" onClick={handleSignupClick}>Sign Up</button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
