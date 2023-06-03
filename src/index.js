import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './components/Navbar.css';
import Login from './components/Login.js'
import Search from './components/Search.js';
import reportWebVitals from './reportWebVitals';
import App from '../src/App'
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
var loggedIn = false;
root.render(
  <BrowserRouter>
    {
      loggedIn ?
      <>
        <App/>
      </>
      :
      <>
        <Login/>
      </>
    }
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
