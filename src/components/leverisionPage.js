import React, { useState, useEffect, useRef } from "react";

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
import "./CSs/ProductleverisonForm.css";
import axios from "axios";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import successAnimation from "../animations/success.json"; // Update with actual path
import PrinterModal from '../components/Widjets/print_dialog';
import Modal from "react-modal";

// Print const 


const ProductLeverision = () => {
  const [products, setProducts] = useState([
    {
      id: 1, // Ensure each product has a unique ID
      Codebar: "",
      searchQuery: "",
      searchResults: [],
      userQuantity: "",
      Quantity: "",
      Pricevent: "",
      Quantitypiece: "",
      total: ""
    }
  ]);
  const [orderDate, setOrderDate] = useState(null);
  const [generalTotal, setGeneralTotal] = useState(0); // State for General Total
  const [montantPay, setMontantPay] = useState(0); // State for Montant Pay
  const [ancienPrix, setAncienPrix] = useState(-generalTotal); // Initial default value for Ancien Prix
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // State for selected supplier
  const [orderNumber, setOrderNumber] = useState("");
  const [inputValue, setInputValue] = useState(""); // Initialize state for storing input value
  const [inputQuantity, setinputQuantity] = useState(""); // Initialize state for storing input value
  const [notev, setNotev] = useState("");
  const [Notevalue, setNote] = useState("");
  const inputRef = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [savedReceptionData, setSavedReceptionData] = useState(null);

  const [printModalOpen, setPrintModalOpen] = useState(false);

  //  just for test --------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToPrint, setProductToPrint] = useState(null);
  const [supplername, setSupplername] = useState(null);



  // const openModal = (content) => {
  //   setModalContent(content);
  //   setModalOpen(true);
  // };

  // ------------------------------------------------

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const inputRefs = useRef([]); // Array of refs for inputs

  const [highlightedIndices, setHighlightedIndices] = useState(
    products.map(() => ({ searchResultIndex: -1 }))
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const handleNoteChange = (event) => {
    const newValue = event.target.value; // Get the new value
    setNotev(newValue); // Update the state
    console.log(newValue); // Print the value to the console
  };

  useEffect(() => {
    setNotev(Notevalue || "");
  }, [Notevalue]);


  /// Handle price input change
  // Handle price input change
  const handlePriceChange = (e, productIndex) => {
    const updatedProducts = [...products];
    const newPrice = parseFloat(e.target.value || 0);
    updatedProducts[productIndex].Pricepay = newPrice;

    const inputQuantity = document.querySelectorAll('.table-input')[productIndex * 7 + 2].value || 0;
    const inputpiece = document.querySelectorAll('.table-input')[productIndex * 7 + 3].value || 0;
    const currentQuantity = parseInt(inputQuantity);

    updatedProducts[productIndex].total = (newPrice * currentQuantity * inputpiece).toFixed(2);

    setProducts(updatedProducts);
    console.log(inputQuantity, newPrice);

  };


  /// test

  // Handle quantity input and calculate total for a product

  //
  // Format the price to .00 when the input loses focus
  const handlePriceBlur = (e, productIndex) => {
    const updatedProducts = [...products];
    const price = parseFloat(e.target.value || 0).toFixed(2); // Format to 2 decimal places
    updatedProducts[productIndex].Pricepay = price; // Update product's price with formatted value
    setProducts(updatedProducts); // Update the state with the formatted price

    // No need to call calculateTotal1 here unless you want to recalculate after formatting the price.
  };

  // Calculate total based on price and quantity

  const calculateGeneralTotal2 = (updatedProducts) => {
    const totalSum = updatedProducts.reduce(
      (sum, product) => sum + parseFloat(product.total || 0),
      0
    );
    setGeneralTotal(totalSum.toFixed(2)); // Update General Total with 2 decimal places
  };
  const navigate = useNavigate(); // Initialize navigate

  const handleAddReception = async () => {
    const receptionData = {
      Norder: orderNumber,
      Dateorder: orderDate,
      supplier_id: selectedSupplier,
      Note: notev,
      GeneralTotal: generalTotal,
      MotantntProice: montantPay,
      AncieantPrcie: ancienPrix,
      products: products.map((product) => ({
        Codebaar: product.Codebar,
        Product: product.searchQuery || null,
        stock: product.Quantitypiece,
        Quantity: inputQuantity,
        Pricepay: product.Pricevent,
        total: product.total,
        Quantitypiece: product.Quantity,
        userQuantity: product.userQuantity || null,
      })),
    };

    try {
      // First API call to create the Livraison
      const response = await axios.post(
        "http://84.247.161.47:5000/api/listLivraison",
        receptionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Response is successfully received.');
        console.log(response.data); // Log the full response to inspect the data

        // Access the savedLivraison and the _id
        const lastInsertedId = response.data.savedLivraison._id;
        console.log("Last Inserted Reception ID:", lastInsertedId); // Log the _id

        const supplierId = response.data.savedLivraison.supplier_id;


        console.log("Last Inserted supplierId ID:", supplierId); // Log the _id
        if (supplierId) {
          console.log("Extracted Supplier ID:", supplierId);
          const supplierResponse = await axios.get(
            `http://84.247.161.47:5000/api/suppliers/${supplierId}`
          );
          const supplierData = supplierResponse.data;
          setSupplername(supplierData._id)

          console.log(supplierData.FullName);

        }

        // Save the reception data
        setSavedReceptionData(response.data.savedLivraison);

        // Now, make a second API call to fetch products based on the _id
        const productResponse = await axios.get(
          `http://84.247.161.47:5000/api/listLivraisonProduct/ProductsByLivraison/${lastInsertedId}`
        );

        if (productResponse.status === 200) {
          console.log("Products for Livraison:", productResponse.data);
          const products = productResponse.data;
          // Check if products exist and have data
          if (products && products.length > 0) {
            // Extract the ListlivraisonId from the first product
            const productId = products[0].ListlivraisonId;
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
        setShowAnimation(true);

        // Hide animation after a few seconds
        setTimeout(() => {
          setShowAnimation(false);
        }, 6000);
      }
    } catch (error) {
      console.error('Error creating Livraison or fetching products:', error.message);
      if (error.response) {
        console.error('Server Response:', error.response.data);
      }
    }
  };



  const fetchLastNorder = async () => {
    try {
      const response = await axios.get(
        "http://84.247.161.47:5000/api/listLivraison/"
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
      const response = await axios.get("http://84.247.161.47:5000/api/suppliers"); // Adjust the API endpoint as needed
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  useEffect(() => {
    getAllSuppliers(); // Call to fetch suppliers when the component mounts
  }, []);

  // 

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
          `http://84.247.161.47:5000/api/lisrProductSiller/search?q=${query}`
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


  // key down 


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
          const nextInput = inputRefs.current[`${productIndex}-userQuantity`];
          if (nextInput) {
            nextInput.focus();
          }
        }
        break;

      default:
        break;
    }
  };

  const handleSearchQueryBlur = (productIndex) => {
    // Focus on the Quantitypiece input when the searchQuery input is blurred
    const nextInput = inputRefs.current[`${productIndex}-userQuantity`];
    if (nextInput) {
      nextInput.focus();
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
  // userQuantity: "",
  // total: "",
  // searchQuery: product.Product, // Set the input value to the selected product's name
  // searchResults: [], // Clear search results after selection
  // Handle product selection from dropdown
  const handleProductSelect = (product, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      userQuantity: "",
      total: "",
      searchQuery: product.Product, // Set the input value to the selected product's name
      searchResults: [], // Clear search results after selection
    };
    setProducts(updatedProducts);

    // Automatically focus on the next input
    const nextInput = inputRefs.current[`${productIndex}-Quantitypiece`];
    if (nextInput) {
      nextInput.focus();
    }
  };

  // Add a new product row to the table
  const addProduct = () => {
    const allInputsFilled = products.every(
      (product) =>
        product.searchQuery.trim() !== "" && product.userQuantity > 0
    );

    if (allInputsFilled) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          inputQuantity: 0,
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


  const originalProducts = [...products]; // Store the original quantities when you initialize the component

  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  const handleQuantityChange = async (e, productIndex) => {
    const inputQuantity = parseInt(e.target.value); // Get the input value and convert it to a number
    const updatedProducts = [...products]; // Create a copy of the products array
    const productName = updatedProducts[productIndex].searchQuery; // Assuming searchQuery stores the product name

    try {
      // Fetch the product details using the search query to get the available quantity
      const response = await axios.get(`http://84.247.161.47:5000/api/lisrProductSiller/search?q=${productName}`);

      // Assuming the response contains an array of products, and we're selecting the first one
      const productData = response.data[0];
      const currentQuantity = parseInt(productData.Quantitypiece); // Get current Quantitypiece from the database

      // If the input field is empty, reset Quantitypiece to the original value
      if (isNaN(inputQuantity)) {
        updatedProducts[productIndex].userQuantity = 0; // Reset userQuantity if input is invalid
        updatedProducts[productIndex].Quantitypiece = currentQuantity; // Reset to original quantity
      } else {
        // Ensure the input quantity doesn't exceed the available stock
        if (inputQuantity > currentQuantity) {
          alert("Input quantity exceeds available stock!");
        } else {
          // Update the user quantity and subtract it from the available stock
          updatedProducts[productIndex].userQuantity = inputQuantity;
          const newQuantity = currentQuantity - inputQuantity;
          updatedProducts[productIndex].Quantitypiece = newQuantity; // Update available quantity in stock
        }
      }

      // Update the products array in the state
      setProducts(updatedProducts);

      // Debugging info
      console.log("Product Index:", productIndex);
      console.log("Input Quantity:", inputQuantity);
      console.log("New Quantity:", updatedProducts[productIndex].Quantitypiece);

      // Pass the inputQuantity to the calculateTotal function if needed
      calculateTotal(updatedProducts, productIndex, inputQuantity);

    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };


  // Calculate total for each product
  // Calculate total based on quantity and price
  const calculateTotal = (
    updatedProducts,
    productIndex,
    inputQuantity,
    priceFinal
  ) => {
    const product = updatedProducts[productIndex];
    const quantityForCalc = parseFloat(inputQuantity || 0); // Use the latest inputQuantity
    const price = priceFinal || parseFloat(product.Pricepay || 0); // Get price from parameter or product
    const inputpiece = document.querySelectorAll('.table-input')[productIndex * 7 + 3].value || 0;
    const total = quantityForCalc * price * inputpiece; // Calculate total based on input value
    updatedProducts[productIndex].total = total.toFixed(2); // Display total with 2 decimal places

    calculateGeneralTotal(updatedProducts); // Recalculate the General Total whenever a product total changes
    setProducts(updatedProducts); // Update the state with the new total
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

        <h1 className="title">Bon For Leverision</h1>
        {/* <button onClick={() => setIsModalOpen(true)}>Open Printer Dialog</button> */}
        <PrinterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToPrint={productToPrint} // Use the correct prop name here

          supplername={supplername} // Use the correct prop name here
        />

        {/* <button onClick={() => openModal("Choose your language: English or French")}>
          Show Popup
        </button>
        <Modal isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
          <h2>Popup Content</h2>
          <p>{modalContent}</p>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </Modal> */}

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
                value={selectedSupplier ? supplierOptions.find(option => option.value === selectedSupplier) : null} // Default value handling
                onChange={handleChange}
                placeholder="Select Supplier"
                isSearchable
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
      {showAnimation && (
        <Lottie options={defaultOptions} height={100} width={100} />
      )}
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
                  "Carton",
                  "Piece product",
                  "prix vent",
                  "My stock",

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
                      ref={inputRef}
                      type="text"
                      className="table-input"
                      value={product.searchQuery || ""}
                      onChange={(e) => handleProductSearch(e, productIndex)}
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
                              const nextInput = inputRefs.current[`${productIndex}-userQuantity`];
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }}
                            onBlur={() => handleSearchQueryBlur(productIndex)}
                          >
                            {searchProduct.Product}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td>
                    <input
                      ref={(el) => (inputRefs.current[`${productIndex}-userQuantity`] = el)} // Assign ref for Quantitypiece
                      type="text"
                      className="table-input"
                      value={products[productIndex].userQuantity || ""}  // Bind the value to the specific product's userQuantity
                      onChange={(e) => handleQuantityChange(e, productIndex)} // Trigger handleQuantityChange on input change
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="table-input small-input"
                      value={product.Quantity || ""}
                    />
                  </td>

                  {/* Price  */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={parseFloat(product.Pricevent || 0).toFixed(2)} // Always display with two decimals
                      onChange={(e) => handlePriceChange(e, productIndex)} // Handle price changes
                      onBlur={(e) => handlePriceBlur(e, productIndex)} // Format to .00 on input blur
                    />
                  </td>
                  {/*  */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.Quantitypiece || ""}
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
            <input type="text" className="input" placeholder="Enter note" value={notev} onChange={handleNoteChange} />
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

export default ProductLeverision;
