import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import {
  Calendar,
  User,
  Grid,
  Plus,
  Trash2,
  ShoppingCart,
  DollarSign,
  Edit3,
  Clipboard,
} from "lucide-react";
import DatePicker from "react-datepicker"; // Import date picker
import "react-datepicker/dist/react-datepicker.css"; // Import date picker styles
import axios from "axios";
import { useParams } from "react-router-dom"; // Import for routing
import PrinterModal from '../components/PrintBonResipstion/print_model';


const EDitingProductReceptionForm = () => {
  const { _id } = useParams(); // Get the ID from URL parameters

  const [products, setProducts] = useState([
    {
      searchQuery: "",
      Quantity: "",
      pieesvalue: "",
      pricevalue: "",
      totalvalue: "",
    },
  ]);
  const [orderDate, setOrderDate] = useState(null);
  const [generalTotal, setGeneralTotal] = useState(0); // State for General Total
  const [montantPay, setMontantPay] = useState(0); // State for Montant Pay
  const [ancienPrix, setAncienPrix] = useState(-generalTotal); // Initial default value for Ancien Prix
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(null); // جعل القيمة الافتراضية null
  const [orderNumber, setOrderNumber] = useState("");
  const [Notevalue, setNote] = useState("");
  const [notev, setNotev] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToPrint, setProductToPrint] = useState(null);
  const [supplername, setSupplername] = useState(null);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef(null);
  const inputRefs = useRef([]); // Array of refs for inputs
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [initialSupplierLoaded, setInitialSupplierLoaded] = useState(false); // لتتبع ما إذا تم تحميل المورد الأولي من الفاتورة

  // const supplierOptions = suppliers.map((supplier) => ({
  //   value: supplier._id,
  //   label: supplier.FullName,
  // }));
  const handleChange = (selectedOption) => {
    setSelectedSupplier(selectedOption ? selectedOption.value : ""); // Store only the _id
  };



  // 
  const [valuttotalgeneral, settotalgeneral] = useState("");
  const [valuemontant, setvaluemontant] = useState("");
  const [valueancientpricx, setncientpricx] = useState("");



  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(
          `http://84.247.161.47:5000/api/productListReception/receptionProducts/${_id}`
        );
        const invoiceData = response.data;

        if (Array.isArray(invoiceData) && invoiceData.length > 0) {
          const invoice = invoiceData[0]; // Access the first invoice in the array

          console.log("Fetched Invoice Data:", invoice);

          // Set state for order details
          setOrderNumber(invoice.Norder);
          setOrderDate(new Date(invoice.Dateorder)); // Use Date object for date picker

          const supplierId = invoice.supplier_id;
          if (supplierId) {
            console.log("Extracted Supplier ID:", supplierId);

            // Fetch the supplier details using the extracted supplier ID
            const supplierResponse = await axios.get(
              `http://84.247.161.47:5000/api/suppliers/${supplierId}`
            );
            const supplierData = supplierResponse.data;

            console.log("Fetched Supplier Data:", supplierData);
            setSuppliers([supplierData]);
            setSelectedSupplier(supplierData._id);
            setInitialSupplierLoaded(true);
          } else {
            console.error("No supplier ID found in invoice data");
          }

          // Fetch additional invoice details using ListbonreceptioneId
          const listbonreceptioneId = invoice.ListbonreceptioneId;
          if (listbonreceptioneId) {
            const bonReceptionResponse = await axios.get(
              `http://84.247.161.47:5000/api/listBonReception/${listbonreceptioneId}`
            );
            const bonReceptionData = bonReceptionResponse.data;

            console.log("Fetched Bon Reception Data:", bonReceptionData);

            // Set Note and other details from the bon reception data
            settotalgeneral(bonReceptionData.GeneralTotal);
            setvaluemontant(bonReceptionData.MotantntProice);
            // Safely extract the first value from AncieantPrcie and format it as a number with two decimal places
            const ancieantPriceValue = Array.isArray(bonReceptionData.AncieantPrcie) && bonReceptionData.AncieantPrcie.length > 0
              ? (Number(bonReceptionData.AncieantPrcie[0]) || 0).toFixed(2) // Format to 2 decimal places
              : "0.00"; // Fallback in case AncieantPrcie is not defined or empty

            setncientpricx(ancieantPriceValue);

            console.log("AncieantPrcie:", bonReceptionData.AncieantPrcie);
            setNote(bonReceptionData.Note);
          } else {
            console.error("No ListbonreceptioneId found in invoice data");
          }

          // Use the entire invoiceData array as products
          const initialProducts = invoiceData.map((product) => ({
            _id_: product._id || "", // Id of product
            productName: product.Product || "", // Product field
            userQuantity: product.Quantity || "", // Set quantity if available
            price: product.Pricepay || "", // Set price if available
            Quantitypiece: product.Quantitypiece || "",
            total: product.GeneralTotal || "", // Set total if available
            pieceUnit: product.Quantitypiece || "", // Add Quantitypiece if needed
          }));

          console.log("Initial Products:", initialProducts); // Print the initialProducts array
          setProducts(initialProducts); // Set the products to the state
        } else {
          console.error("Invoice data is empty or not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData(); // Call to fetch the invoice data
  }, [_id]);

  useEffect(() => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(0); // Reset ancienPrix
      setNotev(0);
    }
  }, [products]); // Dependency on products array\

  const getTodayDate = () => {
    return new Date(); // Returns the current date
  };
  useEffect(() => {
    setOrderDate(getTodayDate());
  }, []);

  // note funtion
  // Step 2: Handle input change

  const handleNoteChange = (event) => {
    const newValue = event.target.value; // Get the new value
    setNotev(newValue); // Update the state
    console.log(newValue); // Print the value to the console
  };

  useEffect(() => {
    setNotev(Notevalue || "");
  }, [Notevalue]);

  const resetValues = () => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(-generalTotal); // Reset ancienPrix
    }
  };

  const handleUpdateReception = async () => {
    // Prepare the updated data for the reception
    const supplierId = selectedSupplier 
    console.log('suppler is ' + supplierId);
    
    const formattedAncienPrix = parseFloat(ancienPrix).toFixed(2);
    const updatedReceptionData = {
      Norder: orderNumber,
      Dateorder: new Date(orderDate),
      supplier_id: selectedSupplier,
      GeneralTotal: generalTotal,
      MotantntProice: montantPay,
      AncieantPrcie: ancienPrix,
      Note: notev,
    };

    console.log(
      "Data to be sent in update request for reception:",
      updatedReceptionData
    );

    try {
      // Update the reception
      const receptionResponse = await axios.put(
        `http://84.247.161.47:5000/api/listBonReception/${_id}`,
        updatedReceptionData
      );
      console.log("Reception updated successfully:", receptionResponse.data);

      await axios.put(
        `http://84.247.161.47:5000/api/suppliers/${selectedSupplier}`,
        {
          ancienPrix: formattedAncienPrix, // Use formattedAncienPrix here
        }
      );

      // Now delete old products before adding new ones
      await deleteOldProducts(_id);

      // Then add new products
      await addNewProducts();
    } catch (error) {
      console.error(
        "Error updating reception:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteOldProducts = async (receptionId) => {
    try {
      const response = await axios.delete(
        `http://84.247.161.47:5000/api/productListReception/${receptionId}`
      );
      // const response1 = await axios.delete(
      //   `http://84.247.161.47:5000/api/lisrProductSiller/sold/${receptionId}`
      // );

      console.log("Old products deleted successfully:", response.data);
    } catch (error) {
      console.error(
        "Error deleting old products:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addNewProducts = async () => {
    // Ensure these variables are correctly set
    // Check if orderNumber is a valid number
    const orderNumberValid =
      Number.isInteger(Number(orderNumber)) && Number(orderNumber) > 0;

    if (!orderNumberValid) {
      console.error("Invalid order number:", orderNumber);
      return; // Exit the function if orderNumber is invalid
    }

    const receptionData = {
      Norder: Number(orderNumber), // Ensure this is a valid number
      Dateorder: new Date(orderDate), // Make sure this is a valid Date object
      supplier_id: selectedSupplier, // Ensure this is the correct ObjectId
      Note:
        document.querySelector('.input[placeholder="Enter note"]').value ||
        null, // Adjust if needed

      GeneralTotal: generalTotal,
      MotantntProice: montantPay,
      AncieantPrcie: ancienPrix,
      products: products.map((product) => ({
        Norder: Number(orderNumber), // Reference the Norder from the reception data
        Dateorder: new Date(orderDate), // Reference the Dateorder from the reception data
        supplier_id: selectedSupplier, // Reference the supplier ID
        Codebaar: product.Codebar || null, // Ensure field name matches the schema
        Product: product.productName || product.searchQuery, // Use 'Product' to match the schema
        Quantity: product.userQuantity || product.Piecesparunite, // Use 'Product' to match the schema
        Quantitypiece: product.Quantitypiece || null, // Ensure to populate quantity properly
        Pricepay: product.price || product.prixdacat, // Ensure field name matches the schema
        total: product.total || null, // Ensure field name matches the schema
      })),
    };

    console.log("Data being sent:", receptionData);

    try {
      const response = await axios.post(
        "http://84.247.161.47:5000/api/listBonReception",
        receptionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reception created successfully:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log('Response is successfully received.');
        console.log(response.data); // Log the full response to inspect the data

        // Access the savedReception and the _id
        const lastInsertedId = response.data.savedReception._id;
        console.log("Last Inserted Reception ID:", lastInsertedId); // Log the _id

        const supplierId = response.data.savedReception.supplier_id;


        console.log("Last Inserted supplierId ID:", supplierId); // Log the _id
        if (supplierId) {
          console.log("Extracted Supplier ID:", supplierId);
          const supplierResponse = await axios.get(
            `http://84.247.161.47:5000/api/suppliers/${supplierId}`
          );
          const supplierData = supplierResponse.data;
          setSupplername(supplierData._id)

          console.log(supplierData.FullName);

        }
        const productResponse = await axios.get(
          `http://84.247.161.47:5000/api/productListReception/receptionProducts/${lastInsertedId}`
        );

        if (productResponse.status === 200) {
          console.log("Products for reception:", productResponse.data);
          const products = productResponse.data;
          // Check if products exist and have data
          if (products && products.length > 0) {
            // Extract the ListlivraisonId from the first product
            const productId = products[0].ListbonreceptioneId;
            console.log("Product ID to be passed:", productId);
            // Now pass the productId to the print model
            setIsModalOpen(true);
            setProductToPrint(lastInsertedId);  // Pass just the ID to the print modal
          } else {
            console.error('No products available for this Livraison');
          }
        } else {
          console.error('Failed to fetch products');
        }
      }
    } catch (error) {
      // Check if error response is available
      if (error.response) {
        console.error("Error creating reception:", error.response.data);
      } else {
        console.error("Error creating reception:", error.message);
      }
    }
  };

  const fetchLastNorder = async () => {
    try {
      const response = await axios.get(
        "http://84.247.161.47:5000/api/listBonReception/all"
      ); // Update with your API endpoint
      const listBonReceptions = response.data;

      // If there are no records, set Norder to 1, otherwise find the max Norder
      const lastNorder =
        listBonReceptions.length > 0
          ? Math.max(...listBonReceptions.map((item) => item.Norder)) + 1
          : 1; // Start from 1 if no records exist

      setOrderNumber(lastNorder); // Set the latest order number
    } catch (error) {
      console.error("Error fetching the last Norder:", error);
    }
  };
  // const addOrder = () => {
  //   const newOrder = {
  //     Norder: orderNumber,
  //     Dateorder: dateOrder,
  //     supplier_id: supplierId,
  //     Note: note,
  //   };

  //   // Call your API to add the order
  //   console.log(newOrder);
  //   // Reset the form if necessary
  //   setOrderNumber('');
  //   setDateOrder('');
  //   setSupplierId('');
  //   setNote('');
  // };

  useEffect(() => {
    fetchLastNorder(); // Call fetchLastNorder on component mount
  }, []);

  // Fetch all suppliers from the server
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get("http://84.247.161.47:5000/api/suppliers");
      const supplierOptions = response.data.map((supplier) => ({
        value: supplier._id,
        label: supplier.FullName,
      }));
      setSupplierOptions(supplierOptions);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };



  useEffect(() => {
    getAllSuppliers(); // Call to fetch suppliers when the component mounts
  }, []);

  // Handle product search input and fetch matching products from the server
  const handleProductSearch = async (e, productIndex) => {
    const query = e.target.value;
    const updatedProducts = [...products];
    updatedProducts[productIndex].searchQuery = query; // Update the specific product's search query
    setProducts(updatedProducts);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `http://84.247.161.47:5000/api/products/search?q=${query}`
        );
        updatedProducts[productIndex].searchResults = response.data; // Set search results for the specific product
        setProducts(updatedProducts);
        console.log("the product detislesis " + updatedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    } else {
      updatedProducts[productIndex].searchResults = []; // Clear results if the query is too short
      setProducts(updatedProducts);
    }
  };

  // pyed number (montenat - general totla)

  const pyedopearitiobbtn = (e, productIndex) => {
    const montantPayValue = generalTotal; // Set montantPayValue to generalTotal
    setMontantPay(montantPayValue);
    setAncienPrix(
      montantPayValue === 0
        ? -generalTotal
        : (generalTotal - montantPayValue).toFixed(2)
    ); // Update Ancien Prix
  };

  // Handle product selection from dropdown
  const handleProductSelect = (product, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex] = {
      ...product,
      Quantitypiece: "",
      total: "",
      searchQuery: product.Designation, // Set the input value to the selected product's name
      searchResults: [], // Clear search results after selection
    };
    setProducts(updatedProducts);
  };

  // Add a new product row to the table
  const addProduct = () => {
    const allInputsFilled = products.every(
      (product) =>
        product.searchQuery?.trim() !== "" && product.userQuantity > 0
    );

    if (allInputsFilled) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          userQuantity: 1,
          searchQuery: "",
          searchResults: [],
          price: 0,
          total: 0,
        },
      ]);
    } else {
      alert("Please fill in all the fields before adding another product.");
    }
  };

  // Remove a product row from the table
  // Remove a product row from the table
  const removeProduct = (productToRemove) => {
    console.log("Deleting product:", productToRemove);
    console.log("Current products before deletion:", products);

    const updatedProducts = products.filter(
      (product) => product !== productToRemove
    );

    console.log("Updated products after deletion:", updatedProducts);
    setProducts(updatedProducts);
    resetValues(); // Call resetValues to check and reset if needed
  };

  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  const handleQuantityChange = (e, productIndex) => {
    const updatedProducts = [...products];
    updatedProducts[productIndex].Quantitypiece = e.target.value;
    calculateTotal(updatedProducts, productIndex);
    setProducts(updatedProducts);
  };

  // Calculate total for each product
  const calculateTotal = (updatedProducts, productIndex) => {
    const product = updatedProducts[productIndex];

    // Log the values used for calculation
    const userQuantity = parseFloat(product.Quantitypiece || 0);
    const productQuantity = parseFloat(
      product.Piecesparunite || product.userQuantity
    );
    const price = parseFloat(product.price || product.prixdacat);

    console.log("Calculating total with values:", {
      userQuantity,
      productQuantity,
      price,
    });

    const total = userQuantity * productQuantity * price;

    // Log the calculated total
    console.log("Calculated total for product:", total);

    updatedProducts[productIndex].total = total.toFixed(2); // Display total with 2 decimal places

    // Log the updated product after total calculation
    console.log(
      "Updated product after total calculation:",
      updatedProducts[productIndex]
    );

    // Recalculate the General Total whenever a product total changes
    calculateGeneralTotal(updatedProducts);
  };

  const calculateGeneralTotal = (updatedProducts) => {
    const totalSum = updatedProducts.reduce((sum, product) => {
      const productTotal = parseFloat(product.total) || 0; // Ensure product.total is a number
      console.log("Product total being added:", productTotal);
      return sum + productTotal;
    }, 0);

    // Log the sum of totals before updating
    console.log("Total Sum of all products:", totalSum);

    setGeneralTotal(totalSum.toFixed(2)); // Update General Total with 2 decimal places
  };

  //note  hudler
  // Step 2: Handle input change

  // Handle Montant Pay input and calculate the Ancien Prix
  const handleMontantPayChange = (e) => {
    const montantPayValue = parseFloat(e.target.value || 0);
    setMontantPay(montantPayValue);
    setAncienPrix(
      montantPayValue === 0
        ? -generalTotal
        : (generalTotal - montantPayValue).toFixed(2)
    ); // Update Ancien Prix
  };

  return (
    <div className="container">
      <div className="title-wrapper">
        <h1 className="title">Edit Bon Redception</h1>

        <PrinterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToPrint={productToPrint} // Use the correct prop name here

          supplername={supplername} // Use the correct prop name here
        />
      </div>

      {/* Form Section */}
      <div className="form-section">
        <div className="form-row">
          <div className="input-group">
            <label className="label">N# Order</label>
            <div className="input-wrapper">
              <User size={18} className="icon" />
              <input
                type="text"
                className="input"
                placeholder="N# Order"
                value={orderNumber}
                readOnly // Make it read-only since it's auto-generated
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Order Date</label>
            <div className="input-wrapper">
              <Calendar size={18} className="icon" />
              <DatePicker
                selected={orderDate}
                onChange={(date) => setOrderDate(date)}
                dateFormat="dd/MM/yyyy"
                className="input"
                placeholderText="Select date"
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Supplier</label>
            <div className="input-wrapper">
              <Select
                className=""
                options={supplierOptions}  // Options containing { value: supplier._id, label: supplier.name }
                value={supplierOptions.find(option => option.value === selectedSupplier)}  // Find the selected supplier by _id
                onChange={handleChange}  // Handle selection change
                placeholder="Select Supplier"
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#ccc',
                    borderRadius: '33px',
                    padding: '8px',
                    width: "200px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'black',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '22px',
                    width: "100%",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? '#1257f6'  // Selected color
                      : state.isFocused
                        ? '#1257f6'  // Focused color
                        : '',        // Default background
                    color: state.isSelected ? '#fff' : '', // White text for selected item
                    width: "100%",
                    transition: 'background-color 0.2s ease', // Smooth transition
                    borderRadius: '22px', // Rounded corners
                  }),
                }}
              />
            </div>
          </div>
          <div className="input-group">
            <label className="label">Categories</label>
            <div className="input-wrapper">
              <Grid size={18} className="icon" />
              <select className="input">
                <option>Choose</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <h2 className="section-title">
          <ShoppingCart className="icon" /> Products
        </h2>
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                {[
                  "Number",
                  "Product",
                  "Carton",
                  "unit piece",

                  "Price pay",
                  "Total",
                ].map((header) => (
                  <th key={header} className="table-header">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, productIndex) => (
                <tr key={product._id || productIndex}>
                  {/* Number (Randomly generated for each product) */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={Math.floor(Math.random() * 10000)}
                      disabled
                    />
                  </td>

                  {/* Product (searchQuery) */}
                  <td>
                    <input
                      ref={inputRef}
                      type="text"
                      className="table-input"
                      value={product.productName || product.searchQuery || ""}
                      onChange={(e) => handleProductSearch(e, productIndex)}
                    />
                    {product.searchResults?.length > 0 && (
                      <ul className="autocomplete-results">
                        {product.searchResults.map((searchProduct) => (
                          <li
                            key={searchProduct._id}
                            onClick={() =>
                              handleProductSelect(searchProduct, productIndex)
                            }
                          >
                            {searchProduct.Designation}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>



                  {/* User Quantity (Editable field)  } */}
                  <td>
                    <input
                      type="number"
                      className="table-input small-input"
                      value={product.Quantitypiece || ""}
                      onChange={(e) => handleQuantityChange(e, productIndex)}
                    />
                  </td>

                  {/* Price pay (Disabled field showing Pricepay) */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.price || product.prixdacat || ""}
                      disabled
                    />
                  </td>
                  {/* Quantity (Disabled field showing Quantity) */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={
                        product.userQuantity || product.Piecesparunite || ""
                      }
                      disabled
                    />
                  </td>

                  {/* Total (Disabled field showing GeneralTotal) */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.total || ""}
                      disabled
                    />
                  </td>

                  {/* Remove Product Button */}
                  <td>
                    <button
                      onClick={() => removeProduct(product)} // تمرير الكائن product مباشرةً
                      className="remove-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Button */}
        <div className="add-product">
          <button onClick={addProduct} className="add-button">
            <Plus className="icon" /> Add product
          </button>
        </div>
      </div>
      <br />

      {/* Additional Note and Payment Section */}
      <div className="form-section">
        {/* Note Input */}
        <div className="input-group">
          <label className="label">Note</label>
          <div className="input-wrapper">
            <Edit3 size={18} className="icon" />
            <input
              type="text"
              className="input"
              placeholder="Enter note"
              value={notev}
              onChange={handleNoteChange}
            />
          </div>
        </div>

        {/* General Total, Montant Pay, and Ancien Prix Section */}
        <div className="input-row">
          {/* General Total Input */}
          <div className="input-group">
            <label className="label">General Total</label>
            <div className="input-wrapper">
              <DollarSign size={18} className="icon" />
              <input
                type="text"
                className="input"
                value={generalTotal || valuttotalgeneral}
                readOnly
              />
            </div>
          </div>

          {/* Montant Pay Input */}
          <div className="input-group">
            <label className="label">Montant Pay</label>
            <div className="input-wrapper">
              <Clipboard size={18} className="icon" />
              <button className="pay-button" onClick={pyedopearitiobbtn}>
                Pay
              </button>{" "}
              {/* Pay Button */}
              <input
                type="number"
                className="input"
                value={montantPay || valuemontant}
                onChange={handleMontantPayChange}
                placeholder="Enter payment"
              />
            </div>
          </div>

          {/* Ancien Prix Input */}
          <div className="input-group">
            <label className="label">Ancien Prix</label>
            <div className="input-wrapper">
              <Clipboard size={18} className="icon" />
              <input
                type="text"
                className="input"
                value={ancienPrix || valueancientpricx}
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="form-row">
          <button
            className="action-button-update"
            onClick={handleUpdateReception}
          >
            Update
          </button>
          <label className="label">
            Length of Product Lines: {products.length}
          </label>
          <button className="action-button close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EDitingProductReceptionForm;
