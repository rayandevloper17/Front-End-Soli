import React, { useEffect, useState } from 'react';
import './CSs/ListReceptionProducts.css';

const ListReceptionProductsTable = () => {
    const [receptionProducts, setReceptionProducts] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        receptionNumber: '',
        dateReceived: '',
        product: '',
        quantity: '',
        pricePaid: '',
    });

    useEffect(() => {
        fetchReceptionProducts();
    }, []);

    const fetchReceptionProducts = async () => {
        try {
            const response = await fetch('http://84.247.161.47:5000/api/listBonReception/all');
            if (!response.ok) {
                throw new Error('Failed to fetch reception products');
            }
            const data = await response.json();
            console.log("Fetched reception products:", JSON.stringify(data, null, 2));
            setReceptionProducts(data);
        } catch (error) {
            console.error('Error fetching reception products:', error);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/productListReception/${selectedProduct._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchReceptionProducts();
                setShowDeleteConfirm(false);
                setSelectedProduct(null);
            } else {
                console.error('Failed to delete:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    const handleUpdateClick = (product) => {
        setSelectedProduct(product);
        const dateReceived = product.Dateordertime ? new Date(product.Dateordertime).toISOString().slice(0, 10) : '';

        // Update formData based on selected product details
        setFormData({
            receptionNumber: product.Norder || '',
            dateReceived: dateReceived,
            product: product.Product || '', // Update this line if you have 
            quantity: product.Quantitypiece || '',
            pricePaid: product.Pricepay || '',
        });
        setShowUpdateForm(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log("Updating product ID:", selectedProduct._id); // Log the product ID
    
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/productListReception/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const responseBody = await response.json(); // Try to log the body
            console.log('Response status:', response.status, responseBody);
    
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
    
            fetchReceptionProducts();
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="reception-products-section">
            <h2>List of Reception Products</h2>
            {receptionProducts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Reception Number</th>
                            <th>Date Received</th>
                            <th>Product</th>                      
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receptionProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product.Norder}</td>
                                <td>{new Date(product.Dateorder).toLocaleDateString()}</td>
                                <td>{product.Product}</td>  {/* Ensure correct product name display */}
                                <td>
                                    <button onClick={() => handleUpdateClick(product)}>Update</button>
                                    <button onClick={() => handleDeleteClick(product)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No reception products available yet.</p>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete the reception product <strong>{selectedProduct?.Product}</strong>?</p>
                        <button onClick={confirmDelete}>Yes, Delete</button>
                        <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Update Product Modal */}
            {showUpdateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Reception Product</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>
                                Reception Number:
                                <input
                                    type="text"
                                    name="receptionNumber"
                                    value={formData.receptionNumber}
                                    onChange={handleFormChange}
                                />
                            </label>
                            <label>
                                Date Received:
                                <input
                                    type="date"
                                    name="dateReceived"
                                    value={formData.dateReceived}
                                    onChange={handleFormChange}
                                />
                            </label>
                            <label>
                                Product:
                                <input
                                    type="text"
                                    name="product"
                                    value={formData.product}
                                    onChange={handleFormChange}
                                />
                            </label>
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListReceptionProductsTable;
