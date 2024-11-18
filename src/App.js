import React from 'react';
import './App.css';
import './styles/style.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Router>
      
      <Navbar /> 
      <div className="container mt-5">
      <ToastContainer/>
       <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
