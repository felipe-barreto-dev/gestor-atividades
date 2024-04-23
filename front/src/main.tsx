import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login.tsx';
import Gestor from './pages/Gestor/Gestor.tsx';
import Cadastro from './pages/Cadastro/Cadastro.tsx';
import ProtectedRoute from './proxy/ProtectedRoute.tsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/gestor",
    element: <ProtectedRoute element={<Gestor />} />,
  },
  {
    path: "/",
    element: <ProtectedRoute element={<Gestor />} />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
