import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // Import autoTable plugin
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InvoicePage = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const { productToPrint } = useParams(); // Get the productId from the URL


    useEffect(() => {
        if (productToPrint) {
            // Fetch the data based on the product ID passed from the URL
            axios
                .get(`http://84.247.161.47:5000/api/listLivraisonProduct/ProductsByLivraison/${productToPrint}`)
                .then((response) => {
                    const data = response.data;
                    if (Array.isArray(data) && data.length > 0) {
                        setInvoiceData(data[0]);  // Set the first object in the array
                        
                    } else {
                        console.error('Invalid data structure');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product data:', error);
                });
        } else {
            console.warn('Product ID is undefined or null');
        }
    }, [productToPrint]);  // Trigger effect when productToPrint changes

    // Function to generate the PDF from the data
    const generatePDF = () => {
        if (!invoiceData) return; // If there's no invoice data, don't generate the PDF.

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Bon De Livraison', 20, 20);

        // Order Information
        doc.setFontSize(12);
        doc.text(`Commande N°: ${invoiceData.Norder}`, 20, 30);
        doc.text(`Date de commande: ${new Date(invoiceData.Dateorder).toLocaleDateString()}`, 20, 40);

        // Add the table headers and data using autoTable
        doc.autoTable({
            startY: 50, // Start below the order info
            head: [['Code-barre', 'Produit', 'Quantité (pièces)', 'Prix Unitaire', 'Total']],
            body: [
                [
                    invoiceData.Codebaar || 'N/A',
                    invoiceData.Product || 'N/A',
                    invoiceData.Quantitypiece || 'N/A',
                    invoiceData.Pricepay || 'N/A',
                    invoiceData.total || 'N/A',
                ]
            ],
        });

        // Summary Section
        doc.text(`Total Général: ${invoiceData.GeneralTotal}`, 20, doc.lastAutoTable.finalY + 10);
        doc.text(`Montant Payé: ${invoiceData.MontantPay}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text(`Dette Actuelle: ${invoiceData.current_debt || 'N/A'}`, 20, doc.lastAutoTable.finalY + 30);

        // Save the generated PDF
        doc.save('invoice.pdf');
    };

    return (
        <div>
            {invoiceData ? (
                <div id="invoice-container">
                    <header>
                        <h2>Bon De Livraison</h2>
                        <p><strong>Commande N°:</strong> {invoiceData.Norder}</p>
                        <p><strong>Date de commande:</strong> {new Date(invoiceData.Dateorder).toLocaleDateString()}</p>
                    </header>

                    <section className="invoice-table-container">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Code-barre</th>
                                    <th>Produit</th>
                                    <th>Quantité (pièces)</th>
                                    <th>Prix Unitaire</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{invoiceData.Codebaar || 'N/A'}</td>
                                    <td>{invoiceData.Product || 'N/A'}</td>
                                    <td>{invoiceData.Quantitypiece || 'N/A'}</td>
                                    <td>{invoiceData.Price1 || 'N/A'}</td>
                                    <td>{invoiceData.total || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="invoice-summary">
                        <p><strong>Total Général:</strong> {invoiceData.GeneralTotal}</p>
                        <p><strong>Montant Payé:</strong> {invoiceData.Paye}</p>
                        <p><strong>Dette Actuelle:</strong> {invoiceData.current_debt || 'N/A'}</p>
                    </section>

                    {/* Print Button */}
                    <div className="header-buttons">
                        <button className="icon-button" onClick={generatePDF}>
                            Print Invoice
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default InvoicePage;
