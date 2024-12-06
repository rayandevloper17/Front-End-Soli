import React, { useEffect, useState } from "react";
import "../SoluStock.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SoluStock = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [clientName, setClientName] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [ancienPrix, setAncienPrix] = useState(""); // State for displaying ancienPrix
  const [originalAncienPrix, setOriginalAncienPrix] = useState(""); // Store the original value
  const [priceInput, setPriceInput] = useState(""); // State for price input
  const [note, setNote] = useState(""); // Note input
  const [dateVersment, setDateVersment] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [deensuppler, setDeensuppler] = useState(""); // State to store the initial debt value
  const [selectedSupplierId, setSelectedSupplierId] = useState(null); // New state for supplier ID
  const [activeIndex, setActiveIndex] = useState(-1); // Track active index in the dropdown
  const [focusedIndex, setFocusedIndex] = useState(null);  // Tracks the index of the focused item


  const navigate = useNavigate(); // Initialize navigate
  useEffect(() => {
    // Fetch suppliers from the server
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://84.247.161.47:5000/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        } else {
          console.error("Failed to fetch suppliers.");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleCloseClick = () => {
    navigate("/"); // Navigate to the home page
  };

  const handleClientNameChange = (e) => {
    const value = e.target.value;
    setClientName(value);

    if (value.length >= 3) {
      const filtered = suppliers.filter((supplier) =>
        supplier.RaisonSocial && supplier.RaisonSocial.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers([]);
    }
  };

  const handleBlur = (e) => {
    let value = e.target.value;

    // If the input value is valid and doesn't have decimal places, add ".00"
    if (value && !value.includes(".")) {
      value = `${value}.00`;
    }

    // Set the value to have exactly two decimal places
    setPriceInput(parseFloat(value).toFixed(2));
  };


  const handleSupplierSelect = (fullName) => {
    // Ensure the fullName is valid and not empty
    if (!fullName) {
      console.error("Invalid supplier name");
      return;
    }
  
    // Set the client name (full name of the supplier)
    setClientName(fullName);
  
    // Find the selected supplier in the list of suppliers
    const selectedSupplier = suppliers.find((supplier) => supplier.RaisonSocial === fullName);
  
    // Ensure that the selected supplier exists and contains the expected properties
    if (selectedSupplier) {
      // Safely extract ancienPrix and parse it as a number (using 0 as a default value)
      const selectedPrix = selectedSupplier.ancienPrix && selectedSupplier.ancienPrix.$numberDecimal
        ? parseFloat(selectedSupplier.ancienPrix.$numberDecimal)
        : 0;
  
      // Log selectedPrix for debugging purposes
      console.log("selectedPrix:", selectedPrix);
  
      // Update states with the supplier data
      setSelectedSupplierId(selectedSupplier._id);
      setAncienPrix(selectedPrix.toFixed(2));  // Use toFixed for formatting the price to 2 decimals
      setOriginalAncienPrix(selectedPrix);  // Keep the original unformatted price if needed
      setDeensuppler(selectedPrix.toFixed(2));  // Set the value of Deensuppler state (adjust this name if necessary)
  
      // Optionally clear the suppliers list to hide the dropdown
      setFilteredSuppliers([]);  // Clear filtered suppliers after selection
    } else {
      // Log an error if the supplier is not found
      console.error("Supplier not found with name:", fullName);
    }
  };
  
  const renderSupplierList = () => {
    return filteredSuppliers.map((supplier, index) => (
      <li
        key={supplier._id}
        onClick={() => handleSupplierSelect(supplier.RaisonSocial)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSupplierSelect(supplier.RaisonSocial);
          }
        }}
        className={focusedIndex === index ? 'focused' : ''}  // Add focused class to highlight
        tabIndex="0"  // Make list item focusable with keyboard
      >
        {/* Ensure RaisonSocial exists before trying to display it */}
        {supplier.RaisonSocial ? supplier.RaisonSocial : 'Unnamed Supplier'}
      </li>
    ));
  };
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      // التنقل للأسفل
      if (focusedIndex < filteredSuppliers.length - 1) {
        setFocusedIndex(focusedIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      // التنقل للأعلى
      if (focusedIndex > 0) {
        setFocusedIndex(focusedIndex - 1);
      }
    } else if (event.key === 'Enter' && focusedIndex >= 0) {
      // تحديد الخيار عند الضغط على Enter
      const selectedSupplier = filteredSuppliers[focusedIndex];
      setClientName(selectedSupplier.RaisonSocial); // تعيين الاسم المختار في الحقل
      setFilteredSuppliers([]); // إخفاء القائمة بعد الاختيار
    }
  };
  




  const handlePriceInputChange = (e) => {
    const enteredPrice = e.target.value;

    setPriceInput(enteredPrice);

    if (enteredPrice === "") {
      setAncienPrix(originalAncienPrix.toFixed(2));
    } else {
      // Use a regular expression to handle possible plus (+) and minus (-) signs
      const parsedPrice = parseFloat(enteredPrice);

      // Check if the entered price is a valid number
      if (!isNaN(parsedPrice)) {
        let updatedAncienPrix;

        // If the original price is negative, add the entered price
        if (originalAncienPrix < 0) {
          updatedAncienPrix = originalAncienPrix + parsedPrice;
        } else {
          updatedAncienPrix = originalAncienPrix - parsedPrice;
        }

        // Update the value of `ancienPrix` and ensure it's always formatted to 2 decimal places
        setAncienPrix(updatedAncienPrix.toFixed(2));
      } else {
        // If the value entered is invalid, reset to the original price formatted to 2 decimals
        setAncienPrix(originalAncienPrix.toFixed(2));
      }
    }
  };


  // Format enteredPrice to have .00 whenever the input loses focus or changes
  const formatPriceInput = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      // Format the value to two decimal places
      e.target.value = parsedValue.toFixed(2);
    }
  };


  const handleSavePayment = async () => {
    const paymentData = {
      dateVersment, // Date field
      clientName, // Full name of the client
      debts: ancienPrix, // Remaining debt amount
      amountPaid: priceInput, // Amount paid by the client
      deensuppler, // The original debt value before changes
      note, // Note for the payment entry
    };

    try {
      // Save the payment
      const response = await fetch("http://84.247.161.47:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert("Payment saved successfully.");

        // Update supplier's ancienPrix (debt)
        if (selectedSupplierId) {
          const formattedAncienPrix = parseFloat(ancienPrix).toFixed(2); // Ensure the value is properly formatted
          await axios.put(
            `http://84.247.161.47:5000/api/suppliers/${selectedSupplierId}`, // Use supplier ID here
            {
              ancienPrix: formattedAncienPrix, // Update with the new debt
            }
          );

          console.log("Supplier ancienPrix updated successfully.");
        } else {
          console.warn("No supplier selected to update ancienPrix.");
        }

        // Clear form fields after successful save and update
        setClientName("");
        setAncienPrix("");
        setOriginalAncienPrix("");
        setDeensuppler(""); // Clear deensuppler
        setPriceInput("");
        setNote("");
      } else {
        console.error("Failed to save payment.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error saving payment:", error.response.data);
      } else {
        console.error("Error saving payment:", error.message);
      }
    }
  };
  return (
    <div className="container">
      <h2>Ajoute versment</h2>
      <div className="form-section">
        <div className="row">
          <div className="col">
            <label className="label" htmlFor="date">
              Date:
            </label>
            <div className="input-icon">
              <i aria-label="Calendar Icon" className="calendar-icon"></i>
              <input
                type="date"
                id="date"
                className="input-field"
                value={dateVersment}
                onChange={(e) => setDateVersment(e.target.value)}
              />
            </div>
            <input
              type="number"
              className="input-field"
              placeholder="Enter the price"
              aria-label="Price Input"
              value={priceInput}
              onChange={handlePriceInputChange}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.target.blur(); // Triggers the onBlur event when Enter is pressed
                }
              }}
            />

          </div>

          <div className="col">
            <label className="label" htmlFor="clientName">
              Nome Clients:
            </label>
            <div className="input-icon">
              <i aria-label="User Icon" className="client-icon"></i>
              <input
                type="text"
                id="clientName"
                className="input-field"
                placeholder="Client Name"
                aria-label="Client Name Input"
                value={clientName}
                onChange={handleClientNameChange}
                onKeyDown={handleKeyDown} // Handle keydown events for navigation
                autoComplete="off" // Disable the browser's autocomplete
              />
              {filteredSuppliers.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {filteredSuppliers.map((supplier, index) => (
                    <li
                      key={supplier._id}
                      onClick={() => handleSupplierSelect(supplier.RaisonSocial)}
                      className={focusedIndex === index ? 'focused' : ''}  // Apply 'focused' class to the highlighted item
                    >
                      {supplier.RaisonSocial}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col">
            <label className="label" htmlFor="clientType">
              Choise Type Clients:
            </label>
            <select
              id="clientType"
              className="select-field"
              aria-label="Client Type Selector"
            >
              <option>All</option>
              <option>Clients</option>
            </select>
            <input
              type="text"
              className="input-field"
              placeholder="Prix metunats"
              aria-label="Prix metunats Input"
              value={ancienPrix}
              readOnly
            />
          </div>
        </div>

        <div className="row">
          <label className="label" htmlFor="note">
            Note For Admin:
          </label>
          <textarea
            id="note"
            className="note-area"
            placeholder="Notez ce dont vous voulez vous souvenir plus tard ..."
            aria-label="Admin Note Text Area"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button
            className="btn btn-add"
            aria-label="Add Entry Button"
            onClick={handleSavePayment}
          >
            ADD
          </button>
          <button className="btn btn-close" onClick={handleCloseClick}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SoluStock;
