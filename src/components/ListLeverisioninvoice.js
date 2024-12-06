import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import './CSs/ListSoldProducts.css'
import {


    Text,

} from '@chakra-ui/react';
const ListVersionProductsTable = () => {
    const [receptionProducts, setReceptionProducts] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
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
            const response = await fetch('http://84.247.161.47:5000/api/listLivraison');
            if (!response.ok) {
                throw new Error('Failed to fetch reception products');
            }
            const data = await response.json();
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
            const response = await fetch(`http://84.247.161.47:5000/api/listLivraison/${selectedProduct._id}`, {
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

        setFormData({
            receptionNumber: product.Norder || '',
            dateReceived: dateReceived,
            product: product.Product || '',
            quantity: product.Quantitypiece || '',
            pricePaid: product.Pricepay || '',
        });
        setShowUpdateForm(true);
    };

    const handleUpdateClick22 = (product) => {
        navigate(`EdiPageTablelevrision/${product._id}`);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://84.247.161.47:5000/api/productListReception/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

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
            <h2>List of Levrison Products</h2>
            {receptionProducts.length > 0 ? (
                <table className="table table2">
                    <thead>
                        <tr>
                            <th>Numéro de facture</th>
                            <th>Date de réception</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receptionProducts.map((product) => (
                            <tr key={product._id}>
                                <td className="px-4 py-3">{product.Norder}</td>
                                <td className="px-4 py-3">{new Date(product.Dateorder).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{product.Note}</td>
                                <div className="bloc">
                                    <button
                                        onClick={() => handleUpdateClick22(product)}
                                        className="btnedit"
                                        title="Edit Product"
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No reception products available yet.</p>
            )}
            {/* Delete Confirmation Modal */}
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
                                <Text as="span" fontWeight="bold">{selectedProduct?.Product}</Text>?
                            </Text>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="btn-delete" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showUpdateForm && (
                <div className="modal fixed">
                    <div className="modal-content rounded-lg">
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
                            <button className="btnedit" type="submit">Update</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)}>Candcel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListVersionProductsTable;
