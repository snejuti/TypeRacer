import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/signup1.css'; // Your styles


export default function SignUp() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function validateEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  }

  function validatePassword(pwd) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|\\,.<>/?]).{8,}$/;
    return re.test(pwd);
  }

  function strengthOf(pwd) {
    if (pwd.length < 8) return 'weak';
    return validatePassword(pwd) ? 'strong' : 'medium';
  }

  function onChange(e) {
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!fields.name.trim()) errs.name = 'Please enter your name';
    if (!validateEmail(fields.email)) errs.email = 'Invalid email';
    if (!validatePassword(fields.password)) errs.password = 'Password must meet criteria';
    if (fields.password !== fields.confirm) errs.confirm = 'Passwords mismatch';
    if (Object.keys(errs).length) return setErrors(errs);

    try {
      const resp = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          password: fields.password,
        }),
      });

      const data = await resp.json();
      console.log(data);

      if (resp.ok) {
        setMsg({ text: 'Signed up successfully! Redirecting…', type: 'success' });
        setTimeout(() => {
          navigate("/leaderboard");
        }, 1000);
      } else {
        setMsg({ text: data.message || "Signup failed", type: 'error' });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMsg({ text: 'Error connecting to server', type: 'error' });
    }
  }

  const strength = strengthOf(fields.password);
  const barWidth = strength === 'weak' ? '30%' : strength === 'medium' ? '60%' : '100%';

  return (
    <div className="container">
      <h2>Create an Account</h2>
      <form id="signupForm" noValidate onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
            value={fields.name}
            onChange={onChange}
          />
          <div className="error">{errors.name}</div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@domain.com"
            required
            value={fields.email}
            onChange={onChange}
          />
          <div className="error">{errors.email}</div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type={showPwd ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="••••••••"
            required
            value={fields.password}
            onChange={onChange}
          />
          <div className="hint">(Min 8 chars, mix of upper/lowercase, number & special char)</div>
          <div className="password-strength">
            <div style={{ width: barWidth }}><div></div></div>
          </div>
          <div className="error">{errors.password}</div>
          <div className="toggle-group">
            <input
              type="checkbox"
              id="togglePassword"
              checked={showPwd}
              onChange={() => setShowPwd(prev => !prev)}
            />
            <label htmlFor="togglePassword">Show password</label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            id="confirmPassword"
            name="confirm"
            placeholder="••••••••"
            required
            value={fields.confirm}
            onChange={onChange}
          />
          <div className="error">{errors.confirm}</div>
          <div className="toggle-group">
            <input
              type="checkbox"
              id="toggleConfirmPassword"
              checked={showConfirm}
              onChange={() => setShowConfirm(prev => !prev)}
            />
            <label htmlFor="toggleConfirmPassword">Show confirm password</label>
          </div>
        </div>

        <button type="submit">Sign Up</button>
        <p id="submitMsg" className={`message ${msg.type}`}>{msg.text}</p>
      </form>
      <p className="center">
        <a href="/login">Already have an account? Log in</a>
      </p>
    </div>
  );
}

