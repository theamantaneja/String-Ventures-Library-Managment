// frontend/src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { UserContext } from '../context/UserContext';

// Import the CSS file
import './css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/users/login', { email, password });
      const { token, user } = response.data;
      login(user, token); // call context function
      setMsg('Login successful!');
      navigate('/'); // redirect to dashboard (default route)
    } catch (error) {
      setMsg(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Display any error or success message */}
      {msg && <p className="login-message">{msg}</p>}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>

      {/* Demo Credentials from the seeder.js file */}
      <div className="demo-credentials">
        <h3>Demo Credentials</h3>
        <div className="credential-block">
          <strong>Admin:</strong>
          <div>Email: admin@library.com</div>
          <div>Password: admin123</div>
        </div>
        <div className="credential-block">
          <strong>Regular User:</strong>
          <div>Email: user@library.com</div>
          <div>Password: user123</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
