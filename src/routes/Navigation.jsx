// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/admin">Admin Dashboard</Link>
        </li>
        <li>
          <Link to="/user">User Dashboard</Link>
        </li>
        {/* Add more navigation links for other routes */}
      </ul>
    </nav>
  );
};

export default Navigation;
