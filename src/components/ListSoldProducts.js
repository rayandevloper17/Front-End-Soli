import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Pencil, Trash2 } from "lucide-react";
import "./CSs/ListSoldProducts.css";
import { Text } from "@chakra-ui/react";
const ListSoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const fetchSoldProducts = async () => {
    try {
      // Fetch sold products data
      const response = await fetch("https://www.k-orissa.com:5000/api/listBonReception/all");
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
        `https://www.k-orissa.com:5000/api/listBonReception/${selectedProduct._id}`,
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

  const handleUpdateClick = (product) => {
    navigate(`EditingProductReceptionForm/${product._id}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="reception-products-section">
      <h2 className="text-3xl font-bold">List of Sold Products</h2>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      <div className="table">
        {soldProducts.length > 0 ? (
          <table className="table2">
            <thead className={`bg-red-200 dark:bg-red-700`}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Order ID ✅</th>
                <th className="px-4 py-3 text-left font-semibold">Dtae </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Client Name{" "}
                </th>


                <th className="px-4 py-3 text-left font-semibold">Total</th>
                <th className="px-4 py-3 text-left font-semibold">Versment</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.map((product) => (
                <tr
                  key={product._id}
                  className={`border-b hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                >
                  <td className="px-4 py-3">{product.Norder}</td>


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
                  <td className="px-4 py-3">{parseFloat(product.GeneralTotal).toFixed(2)}</td>
                  <td className="px-4 py-3">{parseFloat(product.MotantntProice).toFixed(2)}</td>

                  <td className="px-4 py-3">
                    <div className="bloc">
                    <button
                        onClick={() => handleUpdateClick(product)}
                        className="btnedit"
                        title="update Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="btndelet"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
            </div>
            <div className="modal-body">
              <Text>
                Are you sure you want to delete the reception product{" "}
                <Text as="span" fontWeight="bold">
                  {selectedProduct?.Product}
                </Text>
                ?
              </Text>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSoldProducts;
