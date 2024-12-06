// src/components/OrderForm.js
import React, { useState } from 'react';
import './OrderForm.css';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    orderdate: '',
    Dateordertime: '',
    PaySolde: '',
    NomeClients: '',
    Note: '',
    statusTypepayments: '',
    Prixmetunats: '',
    previous_debt: '',
    current_debt: '',
    type: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className='order-form'>
      <h1>Order Details</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='orderdate'>Order Date:</label>
            <input
              type='date'
              id='orderdate'
              value={formData.orderdate}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='Dateordertime'>Order Time:</label>
            <input
              type='time'
              id='Dateordertime'
              value={formData.Dateordertime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='PaySolde'>Payment Balance:</label>
            <input
              type='text'
              id='PaySolde'
              placeholder='Enter payment balance'
              value={formData.PaySolde}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='NomeClients'>Client Name:</label>
            <input
              type='text'
              id='NomeClients'
              placeholder='Enter client name'
              value={formData.NomeClients}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='Note'>Notes:</label>
            <textarea
              id='Note'
              placeholder='Enter any notes'
              value={formData.Note}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='statusTypepayments'>Payment Status:</label>
            <input
              type='text'
              id='statusTypepayments'
              placeholder='Enter payment status'
              value={formData.statusTypepayments}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='Prixmetunats'>Price per Unit:</label>
            <input
              type='text'
              id='Prixmetunats'
              placeholder='Enter price per unit'
              value={formData.Prixmetunats}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='previous_debt'>Previous Debt:</label>
            <input
              type='text'
              id='previous_debt'
              placeholder='Enter previous debt'
              value={formData.previous_debt}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label htmlFor='current_debt'>Current Debt:</label>
            <input
              type='text'
              id='current_debt'
              placeholder='Enter current debt'
              value={formData.current_debt}
              onChange={handleChange}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='type'>Order Type:</label>
            <input
              type='text'
              id='type'
              placeholder='Enter order type'
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type='submit' className='submit-btn'>Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
