import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {// Função que verifica se o usuário está autenticado
  const isAuthenticated = () => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    return !!token;
  };
  
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute