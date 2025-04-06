import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import JazzStatsDashboard from './components/JazzStatsDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <JazzStatsDashboard />
    </React.StrictMode>
);
