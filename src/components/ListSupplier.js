import React, { useEffect, useState } from 'react';
import './CSs/ListSupplier.css';

const ListSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
    const [formData, setFormData] = useState({
        Relasion: '',
        Matricule: '',
        Prenome: '',
        Email: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://84.247.161.47:5000/api/suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleUpdateClick = (supplier) => {
        setSelectedSupplier(supplier);
        setFormData(supplier);
        setShowUpdateForm(true);
    };

    const handleDeleteClick = (supplier) => {
        setSelectedSupplier(supplier);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/suppliers/${selectedSupplier._id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchSuppliers();
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://84.247.161.47:5000/api/suppliers/${selectedSupplier._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchSuppliers();
                setShowUpdateForm(false);
                setSelectedSupplier(null);
                setFormData({
                    Relasion: '',
                    contact: '',
                    address: '',
                    email: ''
                });
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    return (
        <div className="list-product">
            <h1>Supplier List</h1>
            <table>
                <thead>
                    <tr>
                        <th>RaisonSocial</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={supplier._id}>
                            <td>{supplier.Relasion}</td>
                            <td>{supplier.Prenome}</td>
                            <td>{supplier.Matricule}</td>
                            <td>{supplier.Email}</td>
                            <td>
                                <button className="update-button" onClick={() => handleUpdateClick(supplier)}>Update</button>
                                <button className="delete-button" onClick={() => handleDeleteClick(supplier)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showUpdateForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Supplier</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <input type="text" name="Relasion" value={formData.Relasion} onChange={handleChange} placeholder="Relasion" required />
                            <input type="text" name="Prenome" value={formData.Prenome} onChange={handleChange} placeholder="Prenome" required />
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                            <input type="text" name="Matricule" value={formData.Matricule} onChange={handleChange} placeholder="Matricule" required />
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} placeholder="Email" required />
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete the supplier <strong>{selectedSupplier.name}</strong>?</p>
                        <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
                        <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListSupplier;
