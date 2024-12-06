import React, { useEffect, useState } from "react";
import "../SoluStock.css";
import { useParams } from "react-router-dom";
import Lottie from "react-lottie";
import successAnimation from "../animations/success.json"; // Update with actual path
import { useNavigate } from "react-router-dom";

const EditPayment = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [clientName, setClientName] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [ancienPrix, setAncienPrix] = useState("");
  const [originalAncienPrix, setOriginalAncienPrix] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [note, setNote] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
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
      const filtered = suppliers.filter(
        (supplier) =>
          supplier.FullName &&
          supplier.FullName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers([]);
    }
  };

  const handleSupplierSelect = (fullName) => {
    setClientName(fullName);
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.FullName === fullName
    );
    const selectedPrix =
      selectedSupplier && selectedSupplier.ancienPrix
        ? parseFloat(selectedSupplier.ancienPrix.$numberDecimal)
        : 0;
    setAncienPrix(selectedPrix.toFixed(2));
    setOriginalAncienPrix(selectedPrix);
    setFilteredSuppliers([]);
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
              Client Name:
            </label>
            <div className="input-icon">
              <input
                type="text"
                id="clientName"
                className="input-field"
                placeholder="Client Name"
                value={clientName}
                onChange={handleClientNameChange}
              />
              {filteredSuppliers.length > 0 && (
                <ul className="autocomplete-dropdown">
                  {filteredSuppliers.map((supplier) => (
                    <li
                      key={supplier._id}
                      onClick={() => handleSupplierSelect(supplier.FullName)}
                    >
                      {supplier.FullName}
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
