import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Settings from "./components/Settings";
import SoluStock from "./components/SoluStock";
import AddUser from "./components/AddUser";
import ProductReceptionForm from "./components/ProductReceptionForm";
import CardGrid from "./components/CardGrid";
import ProductForm from "./components/ProductForm";
import ListProduct from "./components/ListProduct";
import ListSupplier from "./components/ListSupplier";
import SoldProductsSection from "./components/ListSoldProducts";
import ListReceptionProductsTable from "./components/ListReceptionProductsTable";
import ListVersionProductsTable from "./components/ListLeverisioninvoice";
import Lottie from "lottie-react";
import loadingAnimation from "./components/loading.json";
import ProductReceptionUpdateForm from "./components/UpdateRecipstin/ProductReceptionUpdateForm";
import EditingProductReceptionForm from "./components/EditBonResipsion";
import ProductLeverision from "./components/leverisionPage";
import StatisticsPage from "./components/StatisticsPage";
import PaymentList from "./components/PaymentList";
import ListSoldProducts from "./components/ListSoldProducts";
import ListSoldProductsall from "./components/ProdutcTableSold/list_prdoduct_sold";


import EditPayment from "./components/edit-payment";
import EdiPageTablelevrision from './components/editleverision'
import SupplierTable from './components/ListUsers'
import EditUser from './components/EditUser'
import EditProduct from './components/edit_product'
import ListProducts from './components/ListProducts'
import InvoicePage from './components/PrintPdfs/levisition'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/");
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Clean up event listener and timer
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading-overlay">
          <Lottie animationData={loadingAnimation} style={{ width: '250px', height: '250px' }} />
        </div>
      ) : (
        <>
          <Header />
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<CardGrid />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/productReceptionForm" element={<ProductReceptionForm />} />
              <Route path="/soluStock" element={<SoluStock />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ProductLeverision" element={<ProductLeverision />} />
              <Route path="/ProductForm" element={<ProductForm />} />
              <Route path="/ListProduct" element={<ListProduct />} />
              <Route path="/SoldProductsSection" element={<SoldProductsSection />} />
              <Route path="/ProductReceptionUpdateForm/:id" element={<ProductReceptionUpdateForm />} />
              <Route path="/ListSupplier" element={<ListSupplier />} />
              <Route path="/ListSoldProducts/EditingProductReceptionForm/:_id" element={<EditingProductReceptionForm />} />
              <Route path="/ListReceptionProductsTable" element={<ListReceptionProductsTable />} />
              <Route path="/ListVersionProductsTable" element={<ListVersionProductsTable />} />
              <Route path="/statisticsPage" element={<StatisticsPage />} />
              <Route path="/PaymentList" element={<PaymentList />} />
              <Route path="/ListSoldProducts" element={<ListSoldProducts />} />
              <Route path="/ListSoldProductsall" element={<ListSoldProductsall />} />

              
              <Route path="/edit-payment/:paymentId" element={<EditPayment />} />
              <Route path="/ListVersionProductsTable/EdiPageTablelevrision/:_id" element={<EdiPageTablelevrision />} />
              <Route path="/SupplierTable" element={<SupplierTable />} />
              <Route path="/SupplierTable/EditUser/:id" element={<EditUser />} />
              <Route path="/ListProduct/EditProduct/:_id" element={<EditProduct />} />
              <Route path="/ListProducts" element={<ListProducts />} />
              <Route path="/InvoicePage/:productToPrint" element={<InvoicePage />} />

              
              
            </Routes>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
