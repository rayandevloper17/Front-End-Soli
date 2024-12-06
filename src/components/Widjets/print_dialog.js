import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { X, Printer, Mail, Download } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const PrinterModal = ({ isOpen, onClose, productToPrint ,supplername}) => {
  const [copies, setCopies] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('french');
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [hideNextTime, setHideNextTime] = useState(false);
  const navigate = useNavigate(); // Initialize navigate


  const handlMovenextPage = (paymentId) => {
    navigate(`/`); // Navigate to edit page with the paymentId
  };

  // If the modal is not open, return null
  if (!isOpen) return null;


  const handlePrintClick = async () => {
    try {
      const responsesuppler = await axios.get(
        `http://84.247.161.47:5000/api/suppliers/${supplername}`
      );
      const supplerid = responsesuppler.data[0];
      console.log('Supplier Response:', responsesuppler.data);
  
      const response = await axios.get(
        `http://84.247.161.47:5000/api/listLivraisonProduct/ProductsByLivraison/${productToPrint}`
      );
  
      const invoiceData = response.data; // Assume this returns an array of products
      const doc = new jsPDF();
  
      // Helper function to format numbers safely
      const formatNumber = (value) => {
        const number = Number(value);
        return isNaN(number) ? '0.00' : number.toFixed(2);
      };
  
      // Header styling
      doc.setFont("helvetica");
      doc.setFontSize(24);
      doc.text('Bon De Livraison', 140, 20, { align: 'left' });
  
      // Client information styling
      doc.setFontSize(12);
      doc.text(`Client : ${responsesuppler.data.FullName || ''}`, 20, 20);
      if (invoiceData.length > 0) {
        doc.text(
          `Date de commande: ${new Date(invoiceData[0].Dateorder).toLocaleDateString()} ${new Date(invoiceData[0].Dateorder).toLocaleTimeString()}`,
          20,
          30
        );
      }
  
      // Prepare table rows from the array of products
      const tableRows = invoiceData.map((product) => [
        product.Codebaar || 'aucune valeur',
        product.Product || 'aucune valeur',
        `${product.Quantitypiece || 0}×(${product.userQuantity || 0})`,
        formatNumber(product.Pricepay),
        formatNumber(product.GeneralTotal),
      ]);
  
      // Table styling
      doc.autoTable({
        startY: 40,
        head: [['Code-barre', 'Produit', 'Quantité', 'Prix Unitaire', 'Totale']],
        body: tableRows,
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'left',
          lineWidth: 0.5,
        },
        bodyStyles: {
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        theme: 'plain',
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 70 },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 30, halign: 'right' },
        },
      });
  
      // Summary section styling
      const finalY = doc.lastAutoTable.finalY + 10;
      const totalGeneral = invoiceData.reduce((sum, item) => sum + (item.GeneralTotal || 0), 0);
      const totalPay = invoiceData.reduce((sum, item) => sum + (item.MontantPay || 0), 0);
      const currentDebt = invoiceData.reduce((sum, item) => sum + (item.current_debt || 0), 0);
      const oldDebt = invoiceData.reduce((sum, item) => sum + (item.old_debt || 0), 0);
      const newDebt = invoiceData.reduce((sum, item) => sum + (item.new_debt || 0), 0);
  
      doc.text(`Nombre des produits: ${invoiceData.length}`, 20, finalY);
  
      // Right-aligned summary
      const rightColumnX = 160;
      doc.text('Grand total : ', rightColumnX, finalY);
      doc.text(formatNumber(totalGeneral), rightColumnX + 42, finalY, { align: 'right' });
  
      doc.text('Payé:', rightColumnX, finalY + 10);
      doc.text(formatNumber(totalPay), rightColumnX + 42, finalY + 10, { align: 'right' });
  
      doc.text('Dettes :', rightColumnX, finalY + 20);
      doc.text(formatNumber(currentDebt), rightColumnX + 42, finalY + 20, { align: 'right' });
  
      doc.text('Ancienne dettes :', rightColumnX, finalY + 30);
      doc.text(formatNumber(oldDebt), rightColumnX + 42, finalY + 30, { align: 'right' });
  
      doc.text('Nouveau dette :', rightColumnX, finalY + 40);
      doc.text(formatNumber(newDebt), rightColumnX + 42, finalY + 40, { align: 'right' });
  
      const pdfBlob = doc.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL, '_blank');
      doc.save('bon-de-livraison.pdf');
  
      handlMovenextPage();
  
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Impression</h2>
          <div className="header-buttons">
            <button className="icon-button" onClick={handlePrintClick}>
              <Printer />
            </button>
            <button className="icon-button" onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        <style jsx>{`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      animation: modalEnter 0.3s ease-out;
    }

    @keyframes modalEnter {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    span {
            display: inline-block;
            font-size: 14px; /* Adjust font size */
            font-weight: 600; /* Slightly bold */
            color: #333; /* Neutral dark gray */
            background-color: #ffffff; /* Light gray background */
            padding: 4px 8px; /* Add some padding */
            border-radius: 6px; /* Rounded corners */
            transition: all 0.3s ease; /* Smooth transition effect */
        }

    span:hover {
        color: black; /* White text on hover */
        transform: scale(1.05); /* Slight zoom effect */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .header-buttons {
      display: flex;
      gap: 8px;
    }

    .icon-button {
      background: "#789ef5";
      border: none;
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-button:hover {
      background-color: #0951f7;
    }

    .modal-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .radio-group {
      display: flex;
      gap: 20px;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .form-group label {
      font-size: 14px;
      color: #555;
    }

    .select-input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .select-input:focus {
      border-color: #2196F3;
      outline: none;
    }

    .form-group-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #070f21;
      fontweight: bold;
    }

    .number-input {
      width: 80px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 6px;
      text-align: right;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      border-top: 1px solid #eee;
      background: #f9f9f9;
      border-radius: 0 0 12px 12px;
    }

    .footer-buttons-left {
      display: flex;
      gap: 8px;
    }

    .secondary-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      color: #555;
      cursor: pointer;
      transition: all 0.2s;
    }

    .secondary-button:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }

    .cancel-button2 {
      padding: 8px 16px;
      border: none;
      
      background: #d66a8c;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 9px;
    }

    .cancel-button2:hover {
      background: #e11e5b;
                border-radius: 12px;

    }

    input[type="radio"], input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin: 0;
    }

    input[type="radio"]:checked, input[type="checkbox"]:checked {
      accent-color: #2196F3;
    }
  `}</style>

        {/* Content */}
        <div className="modal-content">
          {/* Language Selection */}
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="language"
                value="arabic"
                checked={selectedLanguage === 'arabic'}
                onChange={(e) => setSelectedLanguage('arabic')}
              />
              <span className="span">Arabe</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="language"
                value="french"
                checked={selectedLanguage === 'french'}
                onChange={(e) => setSelectedLanguage('french')}
              />
              <span>Français</span>
            </label>
          </div>

          {/* Printer Selection */}
          <div className="form-group">
            <label>Imprimante</label>
            <select className="select-input">
              <option>Canon MF8200C Series UFRII LT</option>
            </select>
          </div>

          {/* Copies */}
          <div className="form-group-row">
            <label>Nombre de copies</label>
            <input
              type="number"
              value={copies}
              onChange={(e) => setCopies(parseInt(e.target.value))}
              className="number-input"
              min="0"
            />
          </div>

          {/* Checkboxes */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={generateInvoice}
                onChange={(e) => setGenerateInvoice(e.target.checked)}
              />
              <span>Generer la facture correspondante</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hideNextTime}
                onChange={(e) => setHideNextTime(e.target.checked)}
              />
              <span>La prochaine fois n'afficher pas cette boite</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-buttons-left">
            <button className="secondary-button">
              <Mail />
              <span>E-mail</span>
            </button>
            <button className="secondary-button">
              <Download />
              <span>Exporter</span>
            </button>
          </div>
          <button className="cancel-button2" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrinterModal;



