// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import MainContext from '../context/main/mainContext';

const PrivateRoute = ({ children }) => {
    const {mainState} = useContext(MainContext);
    return mainState.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
