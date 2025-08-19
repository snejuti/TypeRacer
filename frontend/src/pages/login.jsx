import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/login.css'; // Make sure this file exists or adjust the path

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg({ text: 'Both fields are required.', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (res.ok) {
        setMsg({ text: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => {
          navigate('/leaderboard'); // ✅ Redirect to leaderboard
        }, 1000);
      } else {
        setMsg({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (err) {
      console.error('Login error:', err);
      setMsg({ text: 'Server error.', type: 'error' });
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Enter email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            placeholder="Enter password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit">Login</button>
        {msg.text && <p className={`message ${msg.type}`}>{msg.text}</p>}
      </form>

      <p className="center">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
