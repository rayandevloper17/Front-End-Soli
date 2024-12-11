import React, { useState,useRef,useEffect } from "react";
import "./CSs/ProductForm.css"; // Import your CSS file

const ProductForm = () => {
  const [formData, setFormData] = useState({
    minimumfin: "",
    Creationdat: new Date().toISOString().split("T")[0], // Default to today's date
    Modificationdate: new Date().toISOString().split("T")[0],
    datedevalidite: "",
    datedepéremption: "",
    Designation: "",
    Designationar: "",
    selected_option: "",
    Codebar: "",
    Code: "",
    Piecesparunite: "",
    prixdacat: "",
    Famille: "",
    Unitesparpalette: "",
    tva: "",
    Prixdevente: "",
    Prixspecial: "",
    Prixdegros: "",
    Prixextra: "",
    selected_chekbox: "",
    ImageProduct: null,
    benefit: "",
  });

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus on the input when the component loads
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });

    // Handle image preview
    if (type === "file") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null); // Reset if no file
      }
    }
  };
  const formatPriceInput2 = (e) => {
    const value2 = e.target.value;
    const parsedValue2 = parseFloat(value2);
    if (!isNaN(parsedValue2)) {
      // Format the value to two decimal places
      e.target.value = parsedValue2.toFixed(2);
    }
  };
  const formatPriceInput = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      // Format the value to two decimal places
      e.target.value = parsedValue.toFixed(2);
    }
  };
  // The function abt key Down

  const handleKeyDown = (e) => {
    const formElements = Array.from(
      document.querySelectorAll("input, select, textarea")
    );
    const currentIndex = formElements.indexOf(e.target);

    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      const nextElement = formElements[currentIndex + 1];
      if (nextElement) nextElement.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevElement = formElements[currentIndex - 1];
      if (prevElement) prevElement.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Set default value for Unitesparpalette if empty
    const updatedFormData = {
      ...formData,
      Piecesparunite: formData.Piecesparunite || '1', // Default to '1' if not provided
    };
  
    const formDataToSend = new FormData();
    for (const key in updatedFormData) {
      formDataToSend.append(key, updatedFormData[key]);
    }
  
    try {
      const response = await fetch("https://www.k-orissa.com:5000/api/products", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (response.ok) {
        console.log("Product added successfully");
        setSnackbarVisible(true); // Show the snackbar
        resetForm(); // Reset the form fields
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.error("Error:", errorData.error); // Log the error message
        alert(errorData.error); // Show the error to the user
      } else {
        console.error("Failed to add product:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  // Reset form fields
  const resetForm = () => {
    setFormData({
      minimumfin: "",
      Creationdat: new Date().toISOString().split("T")[0],
      Modificationdate: new Date().toISOString().split("T")[0],
      datedevalidite: "",
      datedepéremption: "",
      Designation: "",
      Designationar: "",
      selected_option: "",
      Codebar: "",
      Code: "",
      Piecesparunite: "",
      prixdacat: "",
      Famille: "",
      Unitesparpalette: "",
      tva: "",
      Prixdevente: "",
      Prixspecial: "",
      Prixdegros: "",
      Prixextra: "",
      selected_chekbox: "",
      ImageProduct: null,
      benefit: "",
    });
    setImagePreview(null); // Reset image preview
  };

  // Hide snackbar after 3 seconds
  if (snackbarVisible) {
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  }

  return (
    <>
      {snackbarVisible && (
        <div className="snackbar">Product added successfully!</div>
      )}
      <form
        className="add-user"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default behavior
          handleSubmit(e); // Pass the event to your handleSubmit function
        }}
      >
        <h1>Add Product</h1>
        <div className="form-section">
          <div className="form-group">
            <label>Name Of product</label>
            <input
              ref={inputRef}
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          <div className="form-group">
            <label>Name Of product (Arabic)</label>
            <input
              type="text"
              name="Designationar"
              value={formData.Designationar}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Minimum Fin</label>
            <input
              type="text"
              name="minimumfin"
              value={formData.minimumfin}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Date de Validité</label>
            <input
              type="date"
              name="datedevalidite"
              value={formData.datedevalidite}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Date de Péremption</label>
            <input
              type="date"
              name="datedepéremption"
              value={formData.datedepéremption}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label>Code-barre</label>
            <input
              type="text"
              name="Codebar"
              value={formData.Codebar}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              name="Code"
              value={formData.Code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Prix d'achat</label>
            <input
              type="text"
              name="prixdacat"
              value={formData.prixdacat}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  const formattedValue = value.toFixed(2); // Format to 2 decimal places
                  handleChange({
                    target: { name: "prixdacat", value: formattedValue },
                  });
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>Prix de vente</label>
            <input
              type="text"
              name="Prixdevente"
              value={formData.Prixdevente}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={formatPriceInput}
            />
          </div>
          <div className="form-group">
            <label>Pièces par unité</label>
            <input
              type="text"
              name="Unitesparpalette"
              value={formData.Unitesparpalette}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label>Famille</label>
            <input
              type="text"
              name="Famille"
              value={formData.Famille}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Unité par palette</label>
            <input
              type="text"
              name="Piecesparunite"
              value={formData.Piecesparunite ? formData.Piecesparunite : 1}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>TVA</label>
            <input
              type="text"
              name="tva"
              value={formData.tva ? formData.tva : " 19%"}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Prix spécial</label>
            <input
              type="text"
              name="Prixspecial"
              value={formData.Prixspecial}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Prix de gros</label>
            <input
              type="text"
              name="Prixdegros"
              value={formData.Prixdegros}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <label>Prix extra</label>
            <input
              type="text"
              name="Prixextra"
              value={formData.Prixextra}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label>Benefit</label>
            <input
              type="text"
              name="benefit"
              value={formData.benefit}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image Product</label>
            <br />
            {/* Hidden file input */}
            <input
              type="file"
              name="ImageProduct"
              accept="image/*"
              id="imageUpload"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{ display: "none" }} // Hide the default input
            />

            {/* Custom styled button with icon */}
            <label htmlFor="imageUpload" className="custom-upload-button">
              <i className="upload-icon"></i> {/* Icon for the upload button */}
              <span>Upload Image</span>
            </label>

            {/* Image preview if available */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Uploaded product preview" />
              </div>
            )}
          </div>
          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
