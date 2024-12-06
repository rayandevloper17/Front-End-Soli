import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const PrintVersement = ({ isOpen, onClose, paymentId }) => {
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchPaymentData();
    }
  }, [isOpen, paymentId]);

  useEffect(() => {
    if (paymentData) {
      generatePDF();
    }
  }, [paymentData]);

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(
        `http://84.247.161.47:5000/api/payments/${paymentId}`
      );
      setPaymentData(response.data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  const generatePDF = () => {
    if (!paymentData) return;

    try {
      const doc = new jsPDF();

      // Set font
      doc.setFont('helvetica');

      // Client Information - Moved up and aligned left
      doc.setFontSize(12);
      doc.text(`Clients : ${paymentData.clientName}`, 20, 30);

      const date = new Date(paymentData.dateVersment);
      doc.text(
        `Date de commande : ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
        20,
        40
      );

      // Transaction Header with gray background
      doc.setFillColor(240, 240, 240);
      doc.rect(doc.internal.pageSize.width - 80, 15, 70, 15, 'F');
      doc.setFontSize(16);
      doc.text('Transaction', doc.internal.pageSize.width - 45, 25, { align: 'center' });

      // Table
      const tableHeaders = [['Designation', 'Montant']];
      const tableData = [['Versement', paymentData.amountPaid.toFixed(2)]];

      doc.autoTable({
        startY: 50,
        head: tableHeaders,
        body: tableData,
        styles: {
          fontSize: 12,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [255, 255, 255], // White background
          textColor: [0, 0, 0],
          fontStyle: 'normal',
          lineWidth: 0.1,
        },
        bodyStyles: {
          lineWidth: 0.1,
        },
        theme: 'grid',
        margin: { left: 20, right: 20 },
      });

      // Footer calculations with proper alignment
      const finalY = doc.lastAutoTable.finalY + 10;

      // Right-aligned debt information
      // Define a variable for spacing adjustment
      const valueOffset = 20; // Adjust this to control the spacing

      doc.text('Ancienne dettes :', doc.internal.pageSize.width - 110, finalY + 10);
      doc.text(
        paymentData.deensuppler.toFixed(2),
        doc.internal.pageSize.width - 20 - valueOffset, // Add spacing adjustment
        finalY + 10,
        { align: 'right' }
      );

      doc.text('Nouveau dette :', doc.internal.pageSize.width - 110, finalY + 20);
      doc.text(
        paymentData.debts.toFixed(2),
        doc.internal.pageSize.width - 20 - valueOffset, // Add spacing adjustment
        finalY + 20,
        { align: 'right' }
      );

      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL, '_blank');

      // Close the component after generating
      if (onClose) onClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return null; // Nothing to render since we're directly generating the PDF
};

export default PrintVersement;