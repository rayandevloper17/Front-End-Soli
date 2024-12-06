import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CardGrid from './CardGrid';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <CardGrid />
      </div>
    </div>
  );
};

export default Dashboard;
