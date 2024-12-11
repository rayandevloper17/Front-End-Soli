import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Pencil, Trash2 } from "lucide-react";
import "../CSs/ListSoldProducts.css";
import { Text } from "@chakra-ui/react";
import { FaRegMoneyBillAlt, FaRegClipboard, FaRegListAlt } from 'react-icons/fa';
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";
const ListSoldProductsall = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const fetchSoldProducts = async () => {
    try {
      // Fetch sold products data
      const response = await fetch("https://www.k-orissa.com:5000/api/lisrProductSiller/sold");
      if (!response.ok) throw new Error("Failed to fetch sold products");

      const data = await response.json();

      // For each product, fetch the supplier details
      const productsWithSupplier = await Promise.all(
        data.map(async (product) => {
          if (product.supplier_id && product.supplier_id._id) {
            try {
              // Fetch supplier details using the supplier_id._id
              const supplierResponse = await fetch(
                `https://www.k-orissa.com:5000/api/suppliers/${product.supplier_id._id}`
              );
              if (!supplierResponse.ok) throw new Error("Failed to fetch supplier");

              const supplierData = await supplierResponse.json();
              const supplierName = supplierData?.FullName || "Unknown Supplier";

              // Return the product with the supplier name added
              return {
                ...product,
                supplierName,
              };
            } catch (supplierError) {
              console.error("Error fetching supplier:", supplierError);
              return {
                ...product,
                supplierName: "Unknown Supplier",
              };
            }
          } else {
            // If no supplier_id, return product with "Unknown Supplier"
            return {
              ...product,
              supplierName: "Unknown Supplier",
            };
          }
        })
      );

      // Set the products with supplier name to the state
      setSoldProducts(productsWithSupplier);
      console.log(productsWithSupplier);
    } catch (error) {
      console.error("Error fetching sold products:", error);
    }
  };
  useEffect(() => {
    fetchSoldProducts();
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      const response = await fetch(
        `https://www.k-orissa.com:5000/api/lisrProductSiller/sold/${selectedProduct._id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchSoldProducts();
        setShowDeleteConfirm(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };


  // pdf of list avec price 

  // Function to fetch products and generate PDF


  const generateProductPDF = async () => {
    try {
      // Fetch all products
      const response = await fetch("https://www.k-orissa.com:5000/api/lisrProductSiller/sold");
      if (!response.ok) throw new Error("Failed to fetch sold products");
  
      const products = await response.json();
  
      // Calculate the total of all "GeneralTotal"
      const grandTotal = products.reduce((sum, product) => sum + parseFloat(product.GeneralTotal), 0);
  
      // Create HTML content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="text-align: center; color: #333;">List des produit avec prix</h1>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Order ID</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Price</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${products
                .map(
                  (product) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.Norder}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.Product}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.Quantitypiece}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${parseFloat(product.Pricepay).toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${parseFloat(product.GeneralTotal).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr style="font-weight: bold; background-color: #f9f9f9;">
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Grand Total</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
  
      // Create element for PDF generation
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
  
      // Configure PDF options
      const options = {
        margin: 1,
        filename: "product-list.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      // Generate PDF and open in new tab
      html2pdf().set(options).from(element).toPdf().output('dataurlnewwindow');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="reception-products-section">
      <h2 class="text-3xl font-bold">List of Sold Products</h2>
      <div className="containerbtn">
        <div className="button-group">
          <button className="btn-primary-1" onClick={generateProductPDF}>
            <FaRegMoneyBillAlt className="mr-4" />
            List des produit avec prix
          </button>

          <button className="btn-primary-2">
            <FaRegClipboard className="mr-4" />{/* Increase margin */}
            List des produit avec stock
          </button>
          <button className="btn-primary-3">
            <FaRegListAlt className="mr-7" />{/* Increase margin */}
            List des produit sans stock
          </button>
        </div>
      </div>

      <div className="table">
        {soldProducts.length > 0 ? (
          <table className="table2">
            <thead className={`bg-red-200 dark:bg-red-700`}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Order ID ✅</th>
                <th className="px-4 py-3 text-left font-semibold">Name product </th>
                <th className="px-4 py-3 text-left font-semibold">Dtae </th>
                <th className="px-4 py-3 text-left font-semibold">Fournisuer</th>
                <th className="px-4 py-3 text-left font-semibold">Quqntite</th>
                <th className="px-4 py-3 text-left font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.map((product) => (
                <tr
                  key={product._id}
                  className={`border-b hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                >
                  <td className="px-4 py-3">{product.Norder}</td>
                  <td className="px-4 py-3">{product.Product}</td>
                  <td className="px-4 py-3">
                    {new Date(product.Dateorder).toLocaleString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">{product.supplierName}</td>
                  <td className="px-4 py-3">
                    {product.Quantitypiece} x ({product.Quantity})
                  </td>
                  <td className="px-4 py-3">
                    {parseFloat(product.GeneralTotal).toFixed(2)}
                  </td>
             
                
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <img
              src="/path/to/empty-state-illustration.png"
              alt="No products available"
              className="mx-auto mb-4"
            />
            <p>No sold products available yet.</p>
          </div>
        )}
      </div>
    </div>

  );
};

export default ListSoldProductsall;
