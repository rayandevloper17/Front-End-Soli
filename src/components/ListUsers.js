import React, { useState, useEffect } from 'react';
import './CSs/SuppliersTable.css';
import { useNavigate } from "react-router-dom";

const SuppliersTable = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch suppliers from API
        fetch('https://www.k-orissa.com:5000/api/suppliers')
            .then(response => response.json())
            .then(data => setSuppliers(data))
            .catch(error => console.error('Error fetching suppliers:', error));
    }, []);

    const handleEdit = (id) => {
        const supplier = suppliers.find(sup => sup._id === id);
        setIsEditing(id);
        setFormData(supplier);
    };

    const handleUpdateClick = (id) => {
        navigate(`EditUser/${id}`); // Pass the correct id here
    };

    const handleDelete = (id) => {
        fetch(`https://www.k-orissa.com:5000/api/suppliers/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setSuppliers(suppliers.filter(sup => sup._id !== id));
                }
            })
            .catch(error => console.error('Error deleting supplier:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = (id) => {
        fetch(`https://www.k-orissa.com:5000/api/suppliers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    setSuppliers(suppliers.map(sup => (sup._id === id ? formData : sup)));
                    setIsEditing(null);
                }
            })
            .catch(error => console.error('Error updating supplier:', error));
    };

    return (
        <div className="table-container">
            <h2>Tout les clients</h2>
            <table className="suppliers-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={supplier._id}>
                            <td>
                                {isEditing === supplier._id ? (
                                    <input
                                        type="text"
                                        name="FullName"
                                        value={formData.RaisonSocial || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    supplier.RaisonSocial
                                )}
                            </td>
                            <td>
                                {isEditing === supplier._id ? (
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    supplier.Email
                                )}
                            </td>
                            <td>{supplier.Tel}</td>
                            <td>{supplier.Adress}</td>
                            <td>
                                {isEditing === supplier._id ? (
                                    <button onClick={() => handleSave(supplier._id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleUpdateClick(supplier._id)}>Edit</button>

                                )}
                                <button onClick={() => handleDelete(supplier._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SuppliersTable;
