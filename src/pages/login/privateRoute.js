import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './authContext.js';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
