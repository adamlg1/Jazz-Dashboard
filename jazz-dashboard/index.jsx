import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import JazzStatsDashboard from './components/JazzStatsDashboard';
import Login from './components/login';
import About from './components/about';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<JazzStatsDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />  {/* Add route for About page */}
                <Route path="/stats" element={<JazzStatsDashboard />} />

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
