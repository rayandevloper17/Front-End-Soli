import React, { useEffect, useState } from "react";
import { FaPrint, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import PrintVersement from "../components/PrintVersment/print_versment"; // Make sure path is correct
import "./CSs/PaymentList.css";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const navigate = useNavigate();

  // Fetch payment data from the server
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("https://www.k-orissa.com:5000/api/payments");
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        } else {
          console.error("Failed to fetch payments.");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const handlePrintClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsPrintModalOpen(true);
  };

  const handleDeletePayment = (paymentId) => {
    setShowDeleteModal(true);
    setSelectedPayment(paymentId);
  };

  const confirmDelete = async () => {
    try {
      // Make a DELETE request to the backend to delete the payment
      const response = await fetch(`https://www.k-orissa.com:5000/api/payments/${selectedPayment}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // If the request is successful, remove the payment from the state
        setPayments(payments.filter((payment) => payment._id !== selectedPayment));
        setShowDeleteModal(false);
      } else {
        console.error("Failed to delete payment.");
        alert("Failed to delete payment.");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Error deleting payment.");
    }
  };
  

  const handleEditPayment = (paymentId) => {
    navigate(`/edit-payment/${paymentId}`);
  };

  return (
    <div className="payment-list-container">
      <h2 className="page-title">Payment List</h2>

      {/* Print Modal */}
      <PrintVersement
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        paymentId={selectedPaymentId}
      />

      <table className="payment-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client Name</th>
            <th>Debts</th>
            <th>Amount Paid</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id} className={`table-row ${index % 2 === 0 ? "row-even" : "row-odd"}`}>
              <td>{new Date(payment.dateVersment).toLocaleDateString()}</td>
              <td>{payment.clientName}</td>
              <td>{parseFloat(payment.debts).toFixed(2)}</td> {/* Format debts */}
              <td>{parseFloat(payment.amountPaid).toFixed(2)}</td> {/* Format amountPaid */}
              <td>{payment.note}</td>
              <td className="actions-cell">
                <FaPrint
                  className="icon view-icon"
                  title="Print"
                  onClick={() => handlePrintClick(payment._id)}
                />
                <FaEdit
                  className="icon edit-icon"
                  onClick={() => handleEditPayment(payment._id)}
                  title="Edit"
                />
                <FaTrash
                  className="icon delete-icon"
                  onClick={() => handleDeletePayment(payment._id)}
                  title="Delete"
                />
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <button className="close-button" onClick={() => setShowDeleteModal(false)}>
              <AiOutlineClose />
            </button>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this payment record?</p>
            <button className="confirm-button" onClick={confirmDelete}>Yes, Delete</button>
            <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;