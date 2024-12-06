import React from "react";
import { Package, User, AlertTriangle, Truck } from "lucide-react";
import "./CSs/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="toolbar">
        <div className="expiring-products-container">
          <div className="chip expiring-chip">
            <Package size={20} />
            <span className="expiring-products">
              <span>Expiring products</span>
              <span className="product-count">350</span>
            </span>
          </div>
          <button className="preview-button">
            <Package size={16} />
            Aperçu
          </button>
        </div>

        <div className="user-greeting-container">
          <span className="greeting-text">Hello!</span>
          <span className="user-name">Ben Gourina Djamel</span>
          <div className="chip admin-chip">
            <User size={16} />
            <span>Admin</span>
          </div>
        </div>

        <div className="attention-container">
          <div className="chip attention-chip">
            <AlertTriangle size={20} />
            <span className="attention-text">
              Attention: Un entretien du véhicule est requis
            </span>
          </div>

          <button className="preview-button">
            <Truck size={16} />
            Aperçu
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
