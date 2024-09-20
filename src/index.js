import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/styles/index.css';
import App from './pages/App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* App.js não deve conter outro <Router> */}
  </React.StrictMode>
);
