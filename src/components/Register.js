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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

        const { user, error_t } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if(!error_t){

          const { data, insertError } = await supabase
          .from('reserved')
          .insert([
            { email: email, reservedName: null, player_data_reserved: null }
          ])
          console.log(email);
        

          if (insertError) {
            console.error('Error inserting email into reserved table:', insertError.message);
          } else {
            console.log('Email inserted into reserved table:', data);
          }
        }

        console.log('User:', user);
        navigate("/Home")
        } catch (error) {
        console.error('Login error:', error.message);
        }
    };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          <button type="submit">Register</button>
          <p className="register-text">
            Have an account?
            <a href="/Login" className="register-link">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;