
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import JazzStatsDashboard from './components/JazzStatsDashboard';
import Login from './components/login';
import Register from './components/register';
import About from './components/about';
import ChatBot from './components/chatbot';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Header />
            {/* Add position="top-left" to the ToastContainer */}
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeButton={true}
                pauseOnHover={true}
                draggable={false}
            />
            <Routes>
                <Route path="/" element={<JazzStatsDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/stats" element={<JazzStatsDashboard />} />
                <Route path="/chat" element={<ChatBot />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
