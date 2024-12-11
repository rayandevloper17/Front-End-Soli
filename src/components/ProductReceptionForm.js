import React, { useState, useEffect, useRef, useMemo } from "react";
import Select from 'react-select';

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

import axios from "axios";
import "./CSs/ProductReceptionForm.css";
import PrinterModal from '../components/PrintBonResipstion/print_model';
import { toast } from 'react-toastify'; // Ensure to install 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
const ProductReceptionForm = () => {


  const [products, setProducts] = useState([
    {
      id: 1, // Ensure each product has a unique ID
      Codebar: "",
      searchQuery: "",
      searchResults: [],
      Quantitypiece: "",
      Piecesparunite: "",
      prixdacat: "",
      total: ""
    }
  ]);
  const [orderDate, setOrderDate] = useState(null);
  const [generalTotal, setGeneralTotal] = useState(0); // State for General Total
  const [montantPay, setMontantPay] = useState(0); // State for Montant Pay
  const [ancienPrix, setAncienPrix] = useState(-generalTotal); // Initial default value for Ancien Prix
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // Default value is 'search'
  const [orderNumber, setOrderNumber] = useState("");
  const inputRef = useRef(null);
  const inputRefs = useRef([]); // Array of refs for inputs

  const [searchQuery, setSearchQuery] = useState('');

  // errrors Shoing 
  const [error, setError] = useState(null);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToPrint, setProductToPrint] = useState(null);
  const [supplername, setSupplername] = useState(null);


  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier._id,
    label: supplier.FullName,
  }));
  const handleChange = (selectedOption) => {
    setSelectedSupplier(selectedOption ? selectedOption.value : ""); // Set selected supplier

    // After selection, focus on the input field
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field when a supplier is selected
    }
  };
  // Fi}lter suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.Email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);


  const [highlightedIndices, setHighlightedIndices] = useState(
    products.map(() => ({ searchResultIndex: -1 }))
  );
  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, []);

  const handleSearchQueryBlur = (productIndex) => {
    // Focus on the Quantitypiece input when the searchQuery input is blurred
    const nextInput = inputRefs.current[`${productIndex}-Quantitypiece`];
    if (nextInput) {
      nextInput.focus();
    }
  };
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

  // Handle prixdacat input change
  const handlePrixDacatChange = (e, productIndex) => {
    const updatedProducts = [...products];
    const newPrixDacat = parseFloat(e.target.value || 0); // Get the new prixdacat input
    updatedProducts[productIndex].prixdacat = newPrixDacat; // Update the product's prixdacat

    setProducts(updatedProducts); // Update the state with the new prixdacat
  };

  // Format the prixdacat to .00 when the input loses focus
  const handlePrixDacatBlur = (e, productIndex) => {
    const updatedProducts = [...products];
    const prixDacat = parseFloat(e.target.value || 0).toFixed(2); // Format to 2 decimal places
    updatedProducts[productIndex].prixdacat = prixDacat; // Update product's prixdacat with formatted value
    setProducts(updatedProducts); // Update the state with the formatted prixdacat
  };

  const handleAddReception = async () => {
    // Ensure these variables are correctly set
    const orderNumberValid =
      Number.isInteger(Number(orderNumber)) && Number(orderNumber) > 0;

    if (!orderNumberValid) {
      console.error("Invalid order number:", orderNumber);
      return;
    }
    if (!selectedSupplier) {
      toast.error("Please select a supplier."); // Show toast for missing supplier
      return;
    }
    setError(null);
    // Format ancienPrix to have two decimal places as a string
    const formattedAncienPrix = parseFloat(ancienPrix).toFixed(2);

    const receptionData = {
      Norder: Number(orderNumber),
      Dateorder: new Date(orderDate),
      supplier_id: selectedSupplier,
      Note: document.querySelector('.input[placeholder="Enter note"]').value || null,
      GeneralTotal: generalTotal,
      MotantntProice: montantPay,
      AncieantPrcie: formattedAncienPrix, // Use formattedAncienPrix here
      products: products.map((product) => ({
        Norder: Number(orderNumber),
        Dateorder: new Date(orderDate),
        supplier_id: selectedSupplier,
        Codebaar: product.Codebar || null,
        Product: product.searchQuery || null,
        Quantity: product.Piecesparunite || null,
        Quantitypiece: product.Quantitypiece || null,
        Pricepay: product.prixdacat || null,
        Pricevent: product.Prixdevente || null,
        total: product.total || null,
      })),
    };

    console.log("Data being sent:", receptionData);

    try {
      // Create the reception
      const response = await axios.post(
        "https://www.k-orissa.com:5000/api/listBonReception",
        receptionData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Reception created successfully:", response.data);


      if (response.status === 200 || response.status === 201) {
        console.log('Response is successfully received.');
        console.log(response.data); // Log the full response to inspect the data

        // Access the savedReception and the _id
        const lastInsertedId = response.data.savedReception._id;
        console.log("Last Inserted Reception ID:", lastInsertedId); // Log the _id

        const supplierId = response.data.savedReception.supplier_id;


        console.log("Last Inserted supplierId ID:", supplierId); // Log the _id
        if (supplierId) {
          console.log("Extracted Supplier ID:", supplierId);
          const supplierResponse = await axios.get(
            `https://www.k-orissa.com:5000/api/suppliers/${supplierId}`
          );
          const supplierData = supplierResponse.data;
          setSupplername(supplierData._id)

          console.log(supplierData.FullName);

        }

        // Save the reception data
        // setSavedReceptionData(response.data.savedLivraison);

        // Now, make a second API call to fetch products based on the _id
        const productResponse = await axios.get(
          `https://www.k-orissa.com:5000/api/productListReception/receptionProducts/${lastInsertedId}`
        );

        if (productResponse.status === 200) {
          console.log("Products for reception:", productResponse.data);
          const products = productResponse.data;
          // Check if products exist and have data
          if (products && products.length > 0) {
            // Extract the ListlivraisonId from the first product
            const productId = products[0].ListbonreceptioneId;
            console.log("Product ID to be passed:", productId);
            // Now pass the productId to the print model
            setIsModalOpen(true);
            setProductToPrint(lastInsertedId);  // Pass just the ID to the print modal
          } else {
            console.error('No products available for this Livraison');
          }
        } else {
          console.error('Failed to fetch products');
        }


        // Show animation

      }

      // Update the supplier's ancienPrix
      await axios.put(
        `https://www.k-orissa.com:5000/api/suppliers/${selectedSupplier}`,
        {
          ancienPrix: formattedAncienPrix, // Use formattedAncienPrix here
        }
      );

      console.log("Supplier ancienPrix updated successfully");
    } catch (error) {
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
        "https://www.k-orissa.com:5000/api/listBonReception/all"
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
  useEffect(() => {
    fetchLastNorder(); // Call fetchLastNorder on component mount
  }, []);

  // Fetch all suppliers from the server
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get("https://www.k-orissa.com:5000/api/suppliers");
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
    updatedProducts[productIndex].searchQuery = query;

    // Initialize highlightedIndices if not already set
    const newHighlightedIndices = [...(highlightedIndices || [])];
    newHighlightedIndices[productIndex] = { searchResultIndex: -1 };
    setHighlightedIndices(newHighlightedIndices);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `https://www.k-orissa.com:5000/api/products/search?q=${query}`
        );
        updatedProducts[productIndex].searchResults = response.data;
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    } else {
      updatedProducts[productIndex].searchResults = [];
      setProducts(updatedProducts);
    }
  };

  // pyed number (montenat - general totla)

  const pyedopearitiobbtn = (e, productIndex) => {
    const montantPayValue = generalTotal; // Set montantPayValue to generalTotal
    setMontantPay(montantPayValue);

    const updatedAncienPrix =
      montantPayValue === 0
        ? (-generalTotal).toFixed(2)
        : (generalTotal - montantPayValue).toFixed(2);

    setAncienPrix(updatedAncienPrix); // Update Ancien Prix with two decimal places
    console.log(updatedAncienPrix);

  };


  // Handle product selection from dropdown
  const handleProductSelect = (product, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      Quantitypiece: "",
      total: "",
      searchQuery: product.Designation, // Set the input value to the selected product's name
      searchResults: [], // Clear search results after selection
    };
    setProducts(updatedProducts);

    // Automatically focus on the next input
    const nextInput = inputRefs.current[`${productIndex}-Quantitypiece`];
    if (nextInput) {
      nextInput.focus();
    }
  };

  // Keyboard Navigation for Autocomplete
  const handleAutocompleteKeyDown = (e, productIndex) => {
    const currentProduct = products[productIndex];
    const searchResults = currentProduct.searchResults;

    // Get the current highlighted index
    const currentHighlightedIndex =
      highlightedIndices[productIndex]?.searchResultIndex ?? -1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        console.log("Current highlighted index:", currentHighlightedIndex);
        setHighlightedIndices((prev) => {
          const newIndices = [...prev];
          newIndices[productIndex] = {
            searchResultIndex:
              currentHighlightedIndex < searchResults.length - 1
                ? currentHighlightedIndex + 1
                : 0,
          };
          return newIndices;
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndices((prev) => {
          const newIndices = [...prev];
          newIndices[productIndex] = {
            searchResultIndex:
              currentHighlightedIndex > 0
                ? currentHighlightedIndex - 1
                : searchResults.length - 1,
          };
          return newIndices;
        });
        break;

      case "Enter":
        if (currentHighlightedIndex !== -1 && searchResults.length > 0) {
          e.preventDefault();

          // Select the highlighted item
          const selectedProduct = searchResults[currentHighlightedIndex];
          handleProductSelect(selectedProduct, productIndex);

          // Automatically move to the next input
          const nextInput = inputRefs.current[`${productIndex}-Quantitypiece`];
          if (nextInput) {
            nextInput.focus();
          }
        }
        break;

      default:
        break;
    }
  };



  // Add a new product row to the table
  const addProduct = () => {
    const allInputsFilled = products.every(
      (product) =>
        product.searchQuery.trim() !== "" && product.Quantitypiece > 0
    );

    if (allInputsFilled) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          Quantitypiece: 0,
          searchQuery: "",
          searchResults: [],
        },
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

  // 00

  //00

  // Handle quantity input and calculate total for a product
  const handleQuantityChange = (e, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].Quantitypiece = e.target.value;
    calculateTotal(updatedProducts, productIndex);
    setProducts(updatedProducts);
  };

  // Calculate total for each product
  const calculateTotal = (updatedProducts, productIndex) => {
    const product = updatedProducts[productIndex];
    const Quantitypiece = parseFloat(product.Quantitypiece || 0);
    const productQuantity = parseFloat(product.Piecesparunite || 0);
    const price = parseFloat(product.prixdacat || 0);
    const total = Quantitypiece * productQuantity * price;
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
        <h1 className="title">Bon For Reception</h1>

        <PrinterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToPrint={productToPrint} // Use the correct prop name here

          supplername={supplername} // Use the correct prop name here
        />
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
              <Select
                className=""
                options={supplierOptions}
                value={
                  selectedSupplier
                    ? supplierOptions.find((option) => option.value === selectedSupplier)
                    : null
                }
                onChange={handleChange}
                placeholder="Select Supplier"
                isSearchable
                required
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#ccc', // Change this color as needed
                    borderRadius: '33px',
                    padding: '8px',
                    width: "200px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'black',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '22px',
                    width: "100%",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? '#a9c1f9'  // Blue when selected
                      : state.isFocused
                        ? '#a9c1f9'  // Light blue when focused
                        : '',        // Default background
                    color: state.isSelected ? '#1257f6' : '#ffffff', // White text for selected item
                    width: "100%",
                    transition: 'background-color 0.2s ease', // Smooth transition
                    borderRadius: '22px',  // Rounded corners with 10px radius
                  }),
                }}
              />
            </div>
            {/* Show error message if no supplier is selected */}
            {error && !selectedSupplier && (
              <div style={{ color: "red", marginTop: "10px" }}>
                {error}
              </div>
            )}

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
                  "Cartone",
                  "unit piece",

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
                  {/*   */}
                  <td>
                    <input
                      ref={inputRef}
                      type="text"
                      className="table-input"
                      value={product.searchQuery || ""}
                      onChange={(e) => handleProductSearch(e, productIndex)}
                      onBlur={() => handleSearchQueryBlur(productIndex)}
                      onKeyDown={(e) => handleAutocompleteKeyDown(e, productIndex)} // Add this line
                    />
                    {product.searchResults.length > 0 && (
                      <ul className="autocomplete-results">
                        {product.searchResults.map((searchProduct, index) => (
                          <li
                            key={searchProduct._id}
                            className={
                              highlightedIndices[productIndex]?.searchResultIndex === index
                                ? 'selected-product'
                                : ''
                            }
                            onClick={() => {
                              handleProductSelect(searchProduct, productIndex);

                              // Focus on Quantity input after selection
                              const nextInput = inputRefs.current[`${productIndex}-Quantitypiece`];
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }}
                            onBlur={() => handleSearchQueryBlur(productIndex)}
                          >
                            {searchProduct.Designation}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td>
                    <input
                      ref={(el) => (inputRefs.current[`${productIndex}-Quantitypiece`] = el)} // Assign ref for Quantitypiece
                      type="number"
                      className="table-input small-input"
                      value={product.Quantitypiece || ""}
                      onChange={(e) => handleQuantityChange(e, productIndex)}
                    />
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
                      type="text"
                      className="table-input"
                      value={(parseFloat(product.prixdacat) || 0).toFixed(2)} // Always display with two decimals
                      onChange={(e) => handlePrixDacatChange(e, productIndex)} // Handle prixdacat changes
                      onBlur={(e) => handlePrixDacatBlur(e, productIndex)} // Format to .00 on input blur
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
            Add
          </button>
          <label className="label">
            Length of Product Lines: {products.length}
          </label>
          <button className="action-button close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductReceptionForm;
