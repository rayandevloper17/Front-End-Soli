import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Grid,
  Plus,
  Trash2,
  ShoppingCart,
  DollarSign,
  Edit3,
  Clipboard,
} from "lucide-react";
import DatePicker from "react-datepicker"; // Import date picker
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import "../CSs/ProductReceptionForm.css";

import axios from "axios";

const ProductReceptionUpdateForm = () => {
  const [products, setProducts] = useState([]);
  const [orderDate, setOrderDate] = useState(null);
  const [generalTotal, setGeneralTotal] = useState(0); // State for General Total
  const [montantPay, setMontantPay] = useState(0); // State for Montant Pay
  const [ancienPrix, setAncienPrix] = useState(-generalTotal); // Initial default value for Ancien Prix
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // State for selected supplier
  const [orderNumber, setOrderNumber] = useState("");
  // const [dateOrder, setDateOrder] = useState('');
  // const [supplierId, setSupplierId] = useState('');
  // const [note, setNote] = useState('');
  // Method to reset values
  useEffect(() => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(0); // Reset ancienPrix
    }
  }, [products]); // Dependency on products array\

  const getTodayDate = () => {
    return new Date(); // Returns the current date
  };
  useEffect(() => {
    setOrderDate(getTodayDate());
  }, []);

  const resetValues = () => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(-generalTotal); // Reset ancienPrix
    }
  };

  const handleAddReception = async () => {
    // Ensure these variables are correctly set
    const receptionData = {
      Norder: orderNumber,
      Dateorder: orderDate, // Ensure this is a Date object or formatted correctly
      supplier_id: selectedSupplier,
      Note: document.querySelector('.input[placeholder="Enter note"]').value, // Adjust if needed
      products: products.map((product) => ({
        Codebaar: product.Codebar, // Ensure field name matches the schema
        userQuantity: product.userQuantity,
        Pricepay: product.prixdacat, // Ensure field name matches the schema
        total: product.total,
        Product: product.searchQuery || null, // Use 'Product' to match the schema
      })),
    };

    console.log("Data being sent:", receptionData);

    try {
      const response = await axios.post(
        "https://www.k-orissa.com:5000/api/listBonReception",
        receptionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reception created successfully:", response.data);
    } catch (error) {
      // Check if error response is available
      if (error.response) {
        console.error("Error creating reception:", error.response.data);
      } else {
        console.error("Error creating reception:", error.message);
      }
    }
  };

  const fetchLastNorder = async () => {
    try {
      const response = await axios.get(
        "https://www.k-orissa.com:5000/api/listBonReception"
      ); // Update with your API endpoint
      const listBonReceptions = response.data;

      // If there are no records, set Norder to 1, otherwise find the max Norder
      const lastNorder =
        listBonReceptions.length > 0
          ? Math.max(...listBonReceptions.map((item) => item.Norder)) + 1
          : 1; // Start from 1 if no records exist

      setOrderNumber(lastNorder); // Set the latest order number
    } catch (error) {
      console.error("Error fetching the last Norder:", error);
    }
  };
  // const addOrder = () => {
  //   const newOrder = {
  //     Norder: orderNumber,
  //     Dateorder: dateOrder,
  //     supplier_id: supplierId,
  //     Note: note,
  //   };

  //   // Call your API to add the order
  //   console.log(newOrder);
  //   // Reset the form if necessary
  //   setOrderNumber('');
  //   setDateOrder('');
  //   setSupplierId('');
  //   setNote('');
  // };

  useEffect(() => {
    fetchLastNorder(); // Call fetchLastNorder on component mount
  }, []);

  // Fetch all suppliers from the server
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get("https://www.k-orissa.com:5000/api/suppliers"); // Adjust the API endpoint as needed
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  useEffect(() => {
    getAllSuppliers(); // Call to fetch suppliers when the component mounts
  }, []);

  // Handle product search input and fetch matching products from the server
  const handleProductSearch = async (e, productIndex) => {
    const query = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[productIndex].searchQuery = query; // Update the specific product's search query
    setProducts(updatedProducts);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://www.k-orissa.com:5000/api/products/search?q=${query}`
        );
        updatedProducts[productIndex].searchResults = response.data; // Set search results for the specific product
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    } else {
      updatedProducts[productIndex].searchResults = []; // Clear results if the query is too short
      setProducts(updatedProducts);
    }
  };

  // pyed number (montenat - general totla)

  const pyedopearitiobbtn = (e, productIndex) => {
    const montantPayValue = generalTotal; // Set montantPayValue to generalTotal
    setMontantPay(montantPayValue);
    setAncienPrix(
      montantPayValue === 0
        ? -generalTotal
        : (generalTotal - montantPayValue).toFixed(2)
    ); // Update Ancien Prix
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      userQuantity: "",
      total: "",
      searchQuery: product.Designation, // Set the input value to the selected product's name
      searchResults: [], // Clear search results after selection
    };
    setProducts(updatedProducts);
  };

  // Add a new product row to the table
  const addProduct = () => {
    const allInputsFilled = products.every(
      (product) => product.searchQuery.trim() !== "" && product.userQuantity > 0
    );

    if (allInputsFilled) {
      setProducts([
        ...products,
        { id: Date.now(), userQuantity: 0, searchQuery: "", searchResults: [] },
      ]);
      resetValues(); // Optionally reset values when adding
    } else {
      alert("Please fill in all the fields before adding another product.");
    }
  };

  // Remove a product row from the table
  // Remove a product row from the table
  const removeProduct = (_id) => {
    console.log("Deleting product with _id:", _id);
    console.log("Current products before deletion:", products);

    const updatedProducts = products.filter((product) => product._id !== _id);
    console.log("Updated products after deletion:", updatedProducts);

    setProducts(updatedProducts);
    resetValues(); // Call resetValues to check and reset if needed
  };

  // Handle quantity input and calculate total for a product
  const handleQuantityChange = (e, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].userQuantity = e.target.value;
    calculateTotal(updatedProducts, productIndex);
    setProducts(updatedProducts);
  };

  // Calculate total for each product
  const calculateTotal = (updatedProducts, productIndex) => {
    const product = updatedProducts[productIndex];
    const userQuantity = parseFloat(product.userQuantity || 0);
    const productQuantity = parseFloat(product.Piecesparunite || 0);
    const price = parseFloat(product.prixdacat || 0);
    const total = userQuantity * productQuantity * price;
    updatedProducts[productIndex].total = total.toFixed(2); // Display total with 2 decimal places
    calculateGeneralTotal(updatedProducts); // Recalculate the General Total whenever a product total changes
  };

  // Calculate the General Total (sum of all product totals)
  const calculateGeneralTotal = (updatedProducts) => {
    const totalSum = updatedProducts.reduce(
      (sum, product) => sum + parseFloat(product.total || 0),
      0
    );
    setGeneralTotal(totalSum.toFixed(2)); // Update General Total with 2 decimal places
  };

  // Handle Montant Pay input and calculate the Ancien Prix
  const handleMontantPayChange = (e) => {
    const montantPayValue = parseFloat(e.target.value || 0);
    setMontantPay(montantPayValue);
    setAncienPrix(
      montantPayValue === 0
        ? -generalTotal
        : (generalTotal - montantPayValue).toFixed(2)
    ); // Update Ancien Prix
  };

  return (
    <div className="container">
      <div className="title-wrapper">
        <h1 className="title">Bon For Reception Update</h1>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-row">
          <div className="input-group">
            <label className="label">N# Order</label>
            <div className="input-wrapper">
              <User size={18} className="icon" />
              <input
                type="text"
                className="input"
                placeholder="N# Order"
                value={orderNumber}
                readOnly // Make it read-only since it's auto-generated
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Order Date</label>
            <div className="input-wrapper">
              <Calendar size={18} className="icon" />
              <DatePicker
                selected={orderDate}
                onChange={(date) => setOrderDate(date)}
                dateFormat="dd/MM/yyyy"
                className="input"
                placeholderText="Select date"
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Supplier</label>
            <div className="input-wrapper">
              <User size={18} className="icon" />
              <select
                className="input"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)} // Handle supplier selection
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.Relasion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-group">
            <label className="label">Categories</label>
            <div className="input-wrapper">
              <Grid size={18} className="icon" />
              <select className="input">
                <option>Choose</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <h2 className="section-title">
          <ShoppingCart className="icon" /> Products
        </h2>
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                {[
                  "Number",
                  "Product",
                  "Quantity",
                  "User Quantity",
                  "Price pay",
                  "Total",
                ].map((header) => (
                  <th key={header} className="table-header">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, productIndex) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.Codebar || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.searchQuery || ""}
                      onChange={(e) => handleProductSearch(e, productIndex)}
                    />
                    {product.searchResults.length > 0 && (
                      <ul className="autocomplete-results">
                        {product.searchResults.map((searchProduct) => (
                          <li
                            key={searchProduct._id}
                            onClick={() =>
                              handleProductSelect(searchProduct, productIndex)
                            }
                          >
                            {searchProduct.Designation}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.Piecesparunite || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="table-input small-input"
                      value={product.userQuantity || ""}
                      onChange={(e) => handleQuantityChange(e, productIndex)}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.prixdacat || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.total || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <button
                      onClick={() => removeProduct(product._id)}
                      className="remove-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Button */}
        <div className="add-product">
          <button onClick={addProduct} className="add-button">
            <Plus className="icon" /> Add product
          </button>
        </div>
      </div>
      <br />

      {/* Additional Note and Payment Section */}
      <div className="form-section">
        {/* Note Input */}
        <div className="input-group">
          <label className="label">Note</label>
          <div className="input-wrapper">
            <Edit3 size={18} className="icon" />
            <input type="text" className="input" placeholder="Enter note" />
          </div>
        </div>

        {/* General Total, Montant Pay, and Ancien Prix Section */}
        <div className="input-row">
          {/* General Total Input */}
          <div className="input-group">
            <label className="label">General Total</label>
            <div className="input-wrapper">
              <DollarSign size={18} className="icon" />
              <input
                type="text"
                className="input"
                value={generalTotal}
                readOnly
              />
            </div>
          </div>

          {/* Montant Pay Input */}
          <div className="input-group">
            <label className="label">Montant Pay</label>
            <div className="input-wrapper">
              <Clipboard size={18} className="icon" />
              <button className="pay-button" onClick={pyedopearitiobbtn}>
                Pay
              </button>{" "}
              {/* Pay Button */}
              <input
                type="number"
                className="input"
                value={montantPay}
                onChange={handleMontantPayChange}
                placeholder="Enter payment"
              />
            </div>
          </div>

          {/* Ancien Prix Input */}
          <div className="input-group">
            <label className="label">Ancien Prix</label>
            <div className="input-wrapper">
              <Clipboard size={18} className="icon" />
              <input
                type="text"
                className="input"
                value={ancienPrix}
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="form-row">
          <button className="action-button add" onClick={handleAddReception}>
            Update
          </button>
        </div>
        <label className="label">
          Length of Product Lines: {products.length}
        </label>
      </div>
    </div>
  );
};

export default ProductReceptionUpdateForm;
