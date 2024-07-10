import React from 'react';
import { Outlet } from 'react-router-dom';
import NavvBar from './shared/NavvBar';

const Layout: React.FC = () => {
  return (
    <div className="layout flex flex-col ">
      <NavvBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
