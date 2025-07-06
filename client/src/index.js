import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CarritoProvider } from './context/CarritoContext';
import { UsuarioProvider } from './context/UsuarioContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UsuarioProvider>
    <CarritoProvider>
      <App />
      <ToastContainer />
    </CarritoProvider>
  </UsuarioProvider>
);
