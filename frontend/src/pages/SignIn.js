import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Check for admin login
    if (formData.username === 'admin' && formData.password === 'admin') {
      localStorage.setItem('token', 'admin-token');  // Mock token
      localStorage.setItem('username', 'admin');
      localStorage.setItem('role', 'admin');
      alert("Admin login successful!");
      navigate('/');  // ✅ Redirect to homepage
    } else {
      // Regular user login with backend
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          localStorage.setItem('role', 'user'); // Optional: if you want to distinguish roles
          alert("Login successful!");
          navigate('/');  //  Redirect to homepage
        } else {
          alert("Login failed. Check your username or password.");
        }
      } catch (err) {
        console.error("Error logging in:", err);
        alert("Server error.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleSignIn} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            required
            className="auth-input"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="auth-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="auth-button">Sign In</button>
          <p style={{ marginTop: "1rem" }}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
