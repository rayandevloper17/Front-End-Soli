import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./CSs/ListSoldProducts.css";

import { Moon, Sun, Pencil, Trash2 } from "lucide-react";

const ListProducts = () => {
    const [products, setProducts] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Designation: '',
        Famille: '',
        Prixdevente: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://84.247.161.47:5000/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Pass id to EditProduct Page
    const handleTogoToPageEdit = (_id) => {
        navigate(`EditProduct/${_id}`); // Pass the correct id here
    };

    const handleUpdateClick = (product) => {
        setSelectedProduct(product);
        setFormData({
            Designation: product.Designation || '',
            Famille: product.Famille || '',
            Prixdevente: product.Prixdevente || '',
        });
        setShowUpdateForm(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            fetchProducts();
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/products/${selectedProduct._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchProducts();
                setShowDeleteConfirm(false);
                setSelectedProduct(null);
            } else {
                console.error('Failed to delete:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
        }
    };

    return (
        <div className="product-section">
            <h2 className="text-center">List of Products</h2>
            <table className="table table2">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Designation</th>
                        <th>Famille</th>
                        <th>Prix de vente</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>
                                {product.ImageProduct && (
                                    <div className="image-preview">
                                        <img
                                            src={product.ImageProduct.startsWith('/uploads/')
                                                ? `http://84.247.161.47:5000${product.ImageProduct}`
                                                : product.ImageProduct}
                                            alt={'image-preview'}
                                            className="product-image"
                                            style={{ width: 45, height: 'auto' }}
                                        />
                                    </div>
                                )}
                            </td>
                            <td>{product.Designation}</td>
                            <td>{product.Famille}</td>
                            <td>{product.Prixdevente}</td>
                            <td>

                                <div className="bloc">
                                    <button className="btnedit" onClick={() => handleTogoToPageEdit(product._id)}>

                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button className="btndelet" onClick={() => handleDeleteClick(product)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>                       
                                
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-header">Confirm Deletion</h2>
                        <p className="modal-body">
                            Are you sure you want to delete the product <strong>{selectedProduct?.Designation}</strong>?
                        </p>
                        <div className="modal-footer">
                            <button className="delete-button" onClick={confirmDelete}>Yes, Delete</button>
                            <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showUpdateForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-header">Update Product</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <input
                                type="text"
                                name="Designation"
                                value={formData.Designation}
                                onChange={e => setFormData({ ...formData, Designation: e.target.value })}
                                placeholder="Designation"
                                required
                                className="rounded-lg"
                            />
                            <input
                                type="text"
                                name="Famille"
                                value={formData.Famille}
                                onChange={e => setFormData({ ...formData, Famille: e.target.value })}
                                placeholder="Famille"
                                required
                                className="rounded-lg"
                            />
                            <input
                                type="text"
                                name="Prixdevente"
                                value={formData.Prixdevente}
                                onChange={e => setFormData({ ...formData, Prixdevente: e.target.value })}
                                placeholder="Prix de vente"
                                required
                                className="rounded-lg"
                            />
                            <div className="flex">
                                <button type="submit" className="btnedit">Update</button>
                                <button type="button" className="btndelet" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListProducts;
