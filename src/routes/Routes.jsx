// src/Routes.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from '../components/auth/Login';
import AdminDashboard from '../components/admin/Dashboard';
import UserDashboard from '../components/user/Dashboard';
import PrivateRoute from './PrivateRoute';

const CustomRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route 
        path="admin" 
        element={
          <PrivateRoute> 
            <AdminDashboard /> 
          </PrivateRoute>
        } 
      />
      <Route 
        path="user" 
        element={
          <PrivateRoute> 
            <UserDashboard /> 
          </PrivateRoute>
        } 
      />
      <Route index element={<Navigate to="login" />} />
    </Routes>
  );
};

export default CustomRoutes;
