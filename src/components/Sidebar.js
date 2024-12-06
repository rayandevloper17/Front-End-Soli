import React, { useState } from 'react';
import { Search, Globe, Users, UserPlus, Shield, Settings, ChevronLeft, Menu , ReceiptPoundSterling } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

import './CSs/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <br />
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
          </button>
          <div className="language-toggle">
            <Globe size={24} />
            <div>
              <button className="active">EN</button>
              <button>AR</button>
              <button>FR</button>
            </div>
          </div>

          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." />
          </div>

          <nav className="nav">
            <ul>
              <li>
                <Link to="/">
                  <Users size={18} /> <span>Page Principale</span>
                </Link>
              </li>
              <li>
                <Link to="/addUser">
                  <UserPlus size={18} /> <span>Ajouter un utilisateur</span>
                </Link>
              </li>
              <li>
                <Link to="/productReceptionForm">
                  <Users size={18} /> <span>Afficher tout les utilisateurs</span>
                </Link>
              </li>
              <li>
                <Link to="/soluStock">
                  <Shield size={18} /> <span>Autorisations utilisateur</span>
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <Settings size={18} /> <span>Paramètres de l'entreprise</span>
                </Link>
              </li>

              <li>
                <Link to="/ListProduct">
                  <ReceiptPoundSterling size={18} /> <span>List of tProduct</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      {/* Uncomment the following if you want to have a button to open the sidebar */}
      {/* {!isOpen && (
        <button className="open-sidebar-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      )} */}
    </>
  );
};

export default Sidebar;
