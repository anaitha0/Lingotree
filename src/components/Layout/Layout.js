import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';
import"../../colors.css";
const Layout = () => {
  return (
    <div className="dashboard">
      <Header />
      <Sidebar />
      
        <Outlet /> 
    </div>
  );
};

export default Layout;
