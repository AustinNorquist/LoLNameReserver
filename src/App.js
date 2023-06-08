import React from 'react';
import './App.css';
import Search from '../src/components/Search.js';
import Home from '../src/components/Home.js';
import Profile from '../src/components/Profile.js';
import Navbar from './components/Navbar.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import { Route, Routes } from 'react-router-dom';

export default function App() {
    return(
    <>
        <Navbar/>
        <div className='container'>
            <Routes>
                <Route path="/Home" element={<Home/>}/>
                <Route path="/Login" element={<Login/>}/>
                <Route path="/Register" element={<Register/>}/>
                <Route path="/Search" element={<Search/>}/>
                <Route path="/Profile" element={<Profile/>}/>
            </Routes>     
        </div>
    </>
    )
}