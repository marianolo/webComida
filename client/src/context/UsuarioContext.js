import React, { createContext, useState, useEffect } from 'react';

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Verificar si hay un token guardado
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('usuario');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUsuario(parsedUser);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (responseData) => {
    try {
      console.log('Datos recibidos en login context:', responseData);
      
      let token, userData;
      
      if (responseData.token && responseData.user) {
        // Formato de auth.controller.js
        token = responseData.token;
        userData = responseData.user;
      } else if (responseData.token && responseData.usuario) {
        // Formato de usuarios.controller.js
        token = responseData.token;
        userData = responseData.usuario;
      } else {
        throw new Error('Formato de respuesta inválido');
      }
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      // Actualizar estado
      setUsuario(userData);
      
      console.log('Usuario logueado correctamente:', userData);
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Limpiar estado
      setUsuario(null);
      
      console.log('Usuario deslogueado correctamente');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  };

  const value = {
    usuario,
    login,
    logout,
    loading,
    isAuthenticated: !!usuario
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
};