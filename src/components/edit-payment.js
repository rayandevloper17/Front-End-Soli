import React, { useEffect, useState } from "react";
import "../SoluStock.css";
import { useParams } from "react-router-dom";
import Lottie from "react-lottie";
import successAnimation from "../animations/success.json"; // Update with actual path
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const EditPayment = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [clientName, setClientName] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [ancienPrix, setAncienPrix] = useState("");
  const [originalAncienPrix, setOriginalAncienPrix] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null); // New state for supplier ID
  const [deensuppler, setDeensuppler] = useState(""); // State to store the initial debt value
  const [note, setNote] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);  // Tracks the index of the focused item
  const [dateVersment, setDateVersment] = useState(
   

    new Date().toISOString().split("T")[0]
  );
  const { paymentId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const handleCloseClick = () => {
    navigate("/"); // Navigate to the home page
  };
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    setFocusedIndex(-1);
  }, [filteredSuppliers]);

  const handleKeyDown = (e) => {
    if (filteredSuppliers.length === 0) return;

    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prevIndex =>
        prevIndex < filteredSuppliers.length - 1 ? prevIndex + 1 : prevIndex
      );
    }

    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }

    // Enter
    else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      const selectedSupplier = filteredSuppliers[focusedIndex];
      handleSupplierSelect(selectedSupplier.RaisonSocial);
    }
  };

  useEffect(() => {
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

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(
          `http://84.247.161.47:5000/api/payments/${paymentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setClientName(data.clientName);
          const formattedDebts = data.debts
            ? parseFloat(data.debts).toFixed(2)
            : "0.00";
          setAncienPrix(formattedDebts);
          setOriginalAncienPrix(data.debts);
          const amountPaid1 = data.amountPaid? parseFloat(data.amountPaid).toFixed(2)    : "0.00";
          setPriceInput(amountPaid1);
          
          setDateVersment(data.dateVersment);
          setNote(data.note);
        } else {
          console.error("Failed to fetch payment data.");
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const handleClientNameChange = (e) => {
    const value = e.target.value;
    setClientName(value);

    if (value.length >= 3) {
      const filtered = suppliers.filter((supplier) =>
        supplier.RaisonSocial &&
        supplier.RaisonSocial.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers([]);
    }
  };

  const handleSupplierSelect = (fullName) => {
    if (!fullName) {
      console.error("Invalid supplier name");
      return;
    }

    setClientName(fullName);
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.RaisonSocial === fullName
    );

    if (selectedSupplier) {
      const selectedPrix = selectedSupplier.ancienPrix &&
        selectedSupplier.ancienPrix.$numberDecimal
        ? parseFloat(selectedSupplier.ancienPrix.$numberDecimal)
        : 0;

      setSelectedSupplierId(selectedSupplier._id);
      setAncienPrix(selectedPrix.toFixed(2));
      setOriginalAncienPrix(selectedPrix);
      setDeensuppler(selectedPrix.toFixed(2));
      setFilteredSuppliers([]);
      setFocusedIndex(-1);
    } else {
      console.error("Supplier not found with name:", fullName);
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
  

  const handleBlur = (e) => {
    let value = e.target.value;

    // If the input value is valid and doesn't have decimal places, add ".00"
    if (value && !value.includes(".")) {
      value = `${value}.00`;
    }

    // Set the value to have exactly two decimal places
    setPriceInput(parseFloat(value).toFixed(2));
  };

  const formatPriceInput = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      e.target.value = parsedValue.toFixed(2);
    }
  };
  const handlMovenextPage = (paymentId) => {
    navigate(`/PaymentList`); // Navigate to edit page with the paymentId
  };
  const handleEditPayment = async () => {
    
    const paymentData = {
      dateVersment,
      clientName,
      debts: ancienPrix,
      amountPaid: priceInput,
      note,
    };
    console.log(paymentData);
    

    try {
      const response = await fetch(
        `http://84.247.161.47:5000/api/payments/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (response.ok) {
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
        setShowAnimation(true); // Show animation
      
        // Wait a brief moment for animation to appear, then navigate
        setTimeout(() => {
          setShowAnimation(false); // Hide animation (optional, if you want it to disappear before navigation)
          handlMovenextPage(); // Call your navigation function here
        }, 1000); // Adjust this delay as needed (e.g., 1000ms for a 1-second animation display)
      } else {
        console.error("Failed to update payment.");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };
// Assuming dateVersment is a Date object or a string
const formattedDate = new Date(dateVersment).toISOString().split('T')[0]; // Converts to YYYY-MM-DD

  return (
    <div className="container">
      <h2>Modifier versment</h2>
      <div className="form-section">
        {showAnimation && (
          <Lottie options={defaultOptions} height={100} width={100} />
        )}
        <div className="row">
          <div className="col">
            <label className="label" htmlFor="date">
              Date:
            </label>
            <div className="input-icon">
              <input
                type="date"
                id="date"
                className="input-field"
                value={formattedDate}
                onChange={(e) => setDateVersment(e.target.value)}
              />
            </div>
            <input
              type="number"
              className="input-field"
              placeholder="Enter the price"
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
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {filteredSuppliers.length > 0 && (
                <ul className="autocomplete-dropdown" role="listbox">
                  {filteredSuppliers.map((supplier, index) => (
                    <li
                      key={supplier._id}
                      onClick={() => handleSupplierSelect(supplier.RaisonSocial)}
                      className={focusedIndex === index ? 'focused' : ''}
                      role="option"
                      aria-selected={focusedIndex === index}
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
              Client Type:
            </label>
            <select id="clientType" className="select-field">
              <option>All</option>
              <option>Clients</option>
            </select>
            <input
              type="text"
              className="input-field"
              placeholder="Prix metunats"
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
            placeholder="Note anything important ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button className="btn btn-edit" onClick={handleEditPayment}>
            Edit
          </button>
          <button className="btn btn-close" onClick={handleCloseClick}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditPayment;
