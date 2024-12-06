import React, { useState, useEffect } from 'react';
import './CSs/ProductForm.css'; // Import your CSS file
import { useParams } from "react-router-dom"; // Import for routing
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EditProduct = () => {
    const [formData, setFormData] = useState({
        minimumfin: '',
        Creationdat: new Date().toISOString().split('T')[0], // Default to today's date
        Modificationdate: new Date().toISOString().split('T')[0],
        datedevalidite: '',
        datedepéremption: '',
        Designation: '',
        Designationar: '',
        selected_option: '',
        Codebar: '',
        Code: '',
        Piecesparunite: '',
        prixdacat: '',
        Famille: '',
        Unitesparpalette: '',
        tva: '',
        Prixdevente: '',
        Prixspecial: '',
        Prixdegros: '',
        Prixextra: '',
        selected_chekbox: '',
        ImageProduct: null,
        benefit: ''
    });
    const { _id } = useParams(); // Get the ID from URL parameters
    console.log(_id);
    const navigate = useNavigate();


    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value
        });

        // Handle image preview
        if (type === 'file') {
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

    // The function abt key Down 

    const [snackbar, setSnackbar] = useState({
        message: '',
        isError: false,
        isOpen: false,
    });

    const Snackbar = ({ message, isError, isWarning, isOpen }) => {
        if (!isOpen) return null;

        // Determine the background color based on the type
        const backgroundColor = isError
            ? '#f44336' // red for errors
            : isWarning
                ? '#FFC107' // yellow for warnings
                : '#4CAF50'; // green for success

        return (
            <div style={{
                backgroundColor,
                color: '#fff',
                padding: '16px',
                borderRadius: '4px',
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                fontSize: '16px',
            }}>
                {message}
            </div>
        );
    };


    const handleKeyDown = (e) => {
        const formElements = Array.from(document.querySelectorAll('input, select, textarea'));
        const currentIndex = formElements.indexOf(e.target);

        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            const nextElement = formElements[currentIndex + 1];
            if (nextElement) nextElement.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevElement = formElements[currentIndex - 1];
            if (prevElement) prevElement.focus();
        }
    };



    //  hundel get all products 
    console.log(_id);


    const fetchProductById = async (_id) => {
        try {
            const response = await axios.get(`http://84.247.161.47:5000/api/products/${_id}`);
            const product = response.data;

            // Assuming 'ImageProduct' is returned in the response
            if (product.ImageProduct) {
                setImagePreview(product.ImageProduct);  // Set the image URL for preview
            }

            setFormData(product);  // Populate form data with the fetched product data
   
            console.log(product.ImageProduct);

        } catch (error) {
            console.error('Error fetching product:', error);
            setSnackbar({
                message: 'Error fetching product data.',
                isError: true,
                isOpen: true,
            });
        }
    };
    useEffect(() => {
        if (_id) {
            fetchProductById(_id);  // Fetch user data when component mounts
        }
    }, [_id]);

    // update 
    const handleSubmitUpdate = async (e) => {
        e.preventDefault();

        const updateData = new FormData();
        for (const key in formData) {
            if (formData[key]) {
                updateData.append(key, formData[key]);
            }
        }

        try {
            await axios.put(`http://84.247.161.47:5000/api/products/${_id}`, updateData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Product updated successfully!');
            navigate('/'); // Navigate back to the product list page
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product.');
        }
    };


    // Reset form fields
    const resetForm = () => {
        setFormData({
            minimumfin: '',
            Creationdat: new Date().toISOString().split('T')[0],
            Modificationdate: new Date().toISOString().split('T')[0],
            datedevalidite: '',
            datedepéremption: '',
            Designation: '',
            Designationar: '',
            selected_option: '',
            Codebar: '',
            Code: '',
            Piecesparunite: '',
            prixdacat: '',
            Famille: '',
            Unitesparpalette: '',
            tva: '',
            Prixdevente: '',
            Prixspecial: '',
            Prixdegros: '',
            Prixextra: '',
            selected_chekbox: '',
            ImageProduct: null,
            benefit: ''
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
            <form className="add-user" onSubmit={handleSubmitUpdate}>
                <h1>Edit Product</h1>
                <div className="form-section">
                <div className="form-group">
                        <label>Name Of product</label>
                        <input
                            type="text"
                            name="Designation"
                            value={formData.Designation}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Name Of product (Arabic)
                        </label>
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
                        <label>Prix de vente</label>
                        <input
                            type="text"
                            name="Prixdevente"
                            value={formData.Prixdevente}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="form-group">
                        <label>Pièces par unité</label>
                        <input
                            type="text"
                            name="Piecesparunite"
                            value={formData.Piecesparunite}
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
                            name="Unitesparpalette"
                            value={formData.Unitesparpalette ? formData.Unitesparpalette : 1}
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
                            style={{ display: 'none' }}  // Hide the default input
                        />

                        {/* Custom styled button with icon */}
                        <label
                            htmlFor="imageUpload"
                            className="custom-upload-button"
                        >
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



                    <div className="form-group">
                        <label>Benefit</label>
                        <input type="text" name="benefit" value={formData.benefit} onChange={handleChange} />
                    </div>
                    <button type="submit" className="submit-btn">Edit Product</button>
                </div>
            </form>
        </>
    );
};

export default EditProduct;
