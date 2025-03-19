import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18 and above
import './index.css';
import JazzStatsDashboard from './components/JazzStatsDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <JazzStatsDashboard />
    </React.StrictMode>
);
