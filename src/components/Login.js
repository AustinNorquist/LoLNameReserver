import './Login.css'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Navigate, useNavigate } from 'react-router-dom';
import App from '../App';

const supabaseUrl = 'https://cjqwfctqdxtwyvvqohya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXdmY3RxZHh0d3l2dnFvaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3MzEyNzYsImV4cCI6MjAwMTMwNzI3Nn0.sy61dt6QbjsdPFDGd4Ej7_zO65vi4MPWvqq_bH3KwU8';
const supabase = createClient(supabaseUrl, supabaseKey);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })


        if (error) {
            console.error('Login error:', error.message);
            setErrorMessage("Invalid email or password.");
            return;
        }

        if (!data) {
            <h2>Email or password do not exist.</h2>
            console.error('Invalid credentials');
            return;
        }

        console.log('User:', data);
        navigate("/")
        } catch (error) {
        console.error('Login error:', error.message);
        }
    };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          <button type="submit">Log In</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="register-text">
            Don't have an account?
            <a href="/Register" className="register-link">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
