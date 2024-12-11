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
import "./CSs/ProductleverisonForm.css";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import for routing
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PrinterModal from '../components/Widjets/print_dialog';

const EdiPageTablelevrision = () => {
  const { _id } = useParams(); // Get the ID from URL parameters

  const [products, setProducts] = useState([]);

  const [generalTotal, setGeneralTotal] = useState(0); // State for General Total
  const [montantPay, setMontantPay] = useState(0); // State for Montant Pay
  const [ancienPrix, setAncienPrix] = useState(-generalTotal); // Initial default value for Ancien Prix
  const [suppliers, setSuppliers] = useState([]); // State for suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // State for selected supplier
  const [orderNumber, setOrderNumber] = useState("");
  const [inputValue, setInputValue] = useState(""); // Initialize state for storing input value
  const [inputQuantity, setinputQuantity] = useState(""); // Initialize state for storing input value
  const inputRef = useRef(null);
  const inputRefs = useRef([]); // Array of refs for inputs
  // just test 
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const toast = useToast();
  const [orderDate, setOrderDate] = useState(new Date());
  // of the printer model 


  const [savedReceptionData, setSavedReceptionData] = useState(null);

  const [printModalOpen, setPrintModalOpen] = useState(false);

  //  just for test --------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToPrint, setProductToPrint] = useState(null);
  const [supplername, setSupplername] = useState(null);






  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier._id,
    label: supplier.FullName,
  }));
  const handleChange = (selectedOption) => {
    setSelectedSupplier(selectedOption ? selectedOption.value : ""); // Set selected supplier

    // After selection, focus on the input field
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input field when a supplier is selected
    }
  };


  // 

  // const [dateOrder, setDateOrder] = useState('');
  // const [supplierId, setSupplierId] = useState('');
  // const [note, setNote] = useState('');
  // Method to reset values
  useEffect(() => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(0); // Reset ancienPrix
    }
  }, [products]); // Dependency on products array\

  const getTodayDate = () => {
    return new Date(); // Returns the current date
  };
  useEffect(() => {
    setOrderDate(getTodayDate());
  }, []);

  const resetValues = () => {
    if (products.length === 0) {
      setMontantPay(0); // Reset montantPay
      setGeneralTotal(0); // Reset generalTotal
      setAncienPrix(-generalTotal); // Reset ancienPrix
    }
  };

  /// Handle price input change
  // Handle price input change
  const handlePriceChange = (e, productIndex) => {
    const updatedProducts = [...products];
    const newPrice = parseFloat(e.target.value || 0);
    updatedProducts[productIndex].Pricepay = newPrice;

    const inputQuantity = document.querySelectorAll('.table-input')[productIndex * 7 + 2].value || 0;
    const inputpiece = document.querySelectorAll('.table-input')[productIndex * 7 + 3].value || 0;
    const currentQuantity = parseInt(inputQuantity);

    updatedProducts[productIndex].total = (newPrice * currentQuantity * inputpiece).toFixed(2);

    setProducts(updatedProducts);
    console.log(inputQuantity, newPrice);

  };


  /// test

  // Handle quantity input and calculate total for a product

  //
  // Format the price to .00 when the input loses focus
  const handlePriceBlur = (e, productIndex) => {
    const updatedProducts = [...products];
    const price = parseFloat(e.target.value || 0).toFixed(2); // Format to 2 decimal places
    updatedProducts[productIndex].Pricepay = price; // Update product's price with formatted value
    setProducts(updatedProducts); // Update the state with the formatted price

    // No need to call calculateTotal1 here unless you want to recalculate after formatting the price.
  };

  // Calculate total based on price and quantity

  const calculateGeneralTotal2 = (updatedProducts) => {
    const totalSum = updatedProducts.reduce(
      (sum, product) => sum + parseFloat(product.total || 0),
      0
    );
    setGeneralTotal(totalSum.toFixed(2)); // Update General Total with 2 decimal places
  };



  // ---------------------------------- feetch data from List of leverisones --------------------------------

  const [notev, setNotev] = useState("");

  const [valuttotalgeneral, settotalgeneral] = useState("");
  const [valuemontant, setvaluemontant] = useState("");
  const [valueancientpricx, setncientpricx] = useState("");
  const [Notevalue, setNote] = useState("");



  const handleNoteChange = (event) => {
    const newValue = event.target.value; // Get the new value
    setNotev(newValue); // Update the state
    console.log(newValue); // Print the value to the console
  };

  useEffect(() => {
    setNotev(Notevalue || "");
  }, [Notevalue]);


  //  
  // const initialProducts = invoiceData.map((product) => ({
  //   _id_: product._id || "",
  //   productName: product.Product || "",
  //   userQuantity: product.userQuantity || "",
  //   price: product.Pricepay || "",
  //   Quantitypiece: product.Quantitypiece || "",
  //   Quantity: product.Quantity || "",
  //   stock: product.stock,
  //   total: product.GeneralTotal || "",
  //   pieceUnit: product.Quantitypiece || "",
  // }));

  // setProducts(initialProducts);
  // }

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(
          `https://www.k-orissa.com:5000/api/listLivraisonProduct/ProductsByLivraison/${_id}`
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
              `https://www.k-orissa.com:5000/api/suppliers/${supplierId}`
            );
            const supplierData = supplierResponse.data;

            console.log("Fetched Supplier Data:", supplierData);
            setSelectedSupplier(supplierData._id); // Set selectedSupplier to the supplier ID
            setSuppliers([supplierData]); // Store the supplier in suppliers state
          } else {
            console.error("No supplier ID found in invoice data");
          }

          // Fetch additional invoice details using ListbonreceptioneId
          const listbonreceptioneId = invoice.ListlivraisonId;
          if (listbonreceptioneId) {
            const bonReceptionResponse = await axios.get(
              `https://www.k-orissa.com:5000/api/listLivraison/${listbonreceptioneId}`
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
            _id_: product._id || "",
            productName: product.Product || "",
            userQuantity: product.userQuantity || "",
            price: product.Pricepay || "",
            Quantitypiece: product.Quantitypiece || "",
            Quantity: product.Quantity || "",
            stock: product.stock,
            total: product.GeneralTotal || "",
            pieceUnit: product.Quantitypiece || "",
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



  //  ---------------------------------------------------------- Update bittorrents --------------------------------------------------------

  const handlMovenextPage = (paymentId) => {
    navigate(`/`); // Navigate to edit page with the paymentId
  };
  const handleUpdateLeverision = async () => {
    // Prepare the updated data for the reception
    const updatedLeverisionData = {
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
      updatedLeverisionData
    );
    try {
      // Update the reception
      const receptionResponse = await axios.put(
        `https://www.k-orissa.com:5000/api/listLivraison/${_id}`,
        updatedLeverisionData
      );
      console.log("Reception updated successfully:", receptionResponse.data);
      // Now delete old products before adding new ones
      await deleteOldProducts(_id);
      await addNewProducts();
      //  end it -------------------------------------------------- 
      // Show success toast
      toast({
        title: "Success",
        description: "Reception updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });


    } catch (error) {
      console.error(
        "Error updating reception:",
        error.response ? error.response.data : error.message
      );

      // Optionally, show an error toast if the update fails
      toast({
        title: "Error",
        description: "Failed to update reception.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const deleteOldProducts = async (LeverionID) => {
    try {
      const response = await axios.delete(
        `https://www.k-orissa.com:5000/api/listLivraisonProduct/${LeverionID}`
      );

      const response1 = await axios.delete(
        `https://www.k-orissa.com:5000/api/listLivraison/${LeverionID}`
      );
      // const response1 = await axios.delete(
      //   `https://www.k-orissa.com:5000/api/lisrProductSiller/sold/${receptionId}`
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
        Codebaar: product.Codebar, // Ensure field name matches the schema
        Product: product.productName || product.searchQuery, // Use 'Product' to match the schema
        stock: product.Quantitypiece,
        Quantity: product.inputQuantity || product.Quantitypiec,
        Pricepay: product.price || product.Pricevent, // Ensure field name matches the schema
        total: product.total,
        Quantitypiece: product.Quantity || product.Quantitypiece,
        userQuantity: product.userQuantity
      })),
    };

    console.log("Data being sent:", receptionData);

    try {
      const response = await axios.post(
        "https://www.k-orissa.com:5000/api/listLivraison",
        receptionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reception created successfully:", response.data);

      if (response.status === 200 || response.status === 201) {
        console.log('Hey sir this the new products update is successful 🤦‍♂️🤦‍♂️');
        console.log(response.data); // Log the full receptionResponse to inspect the data

        // Access the savedLivraison and the _id
        const lastInsertedId = response.data.savedLivraison._id;
        console.log("Last Inserted Reception ID:", lastInsertedId); // Log the _id

        const supplierId = response.data.savedLivraison.supplier_id;
        if (supplierId) {
          console.log("Extracted Supplier ID:", supplierId);
          const supplierResponse = await axios.get(
            `https://www.k-orissa.com:5000/api/suppliers/${supplierId}`
          );
          const supplierData = supplierResponse.data;
          setSupplername(supplierData._id)

          console.log(supplierData.FullName);

        }




        const productResponse = await axios.get(
          `https://www.k-orissa.com:5000/api/listLivraisonProduct/ProductsByLivraison/${lastInsertedId}`
        );

        if (productResponse.status === 200) {
          console.log("Products for Livraison:", productResponse.data);
          const products = productResponse.data;
          // Check if products exist and have data
          if (products && products.length > 0) {
            // Extract the ListlivraisonId from the first product
            const productId = products[0].ListlivraisonId;
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


  //  ---------------------------------------------- end --------------------------------------------------------

  const handleAddReception = async () => {
    // Ensure these variables are correctly set
    const receptionData = {
      Norder: orderNumber,
      Dateorder: orderDate, // Ensure this is a Date object or formatted correctly
      supplier_id: selectedSupplier,
      Note: document.querySelector('.input[placeholder="Enter note"]').value, // Adjust if needed
      GeneralTotal: generalTotal,
      MotantntProice: montantPay,
      AncieantPrcie: ancienPrix,
      products: products.map((product) => ({
        Codebaar: product.Codebar, // Ensure field name matches the schema
        Product: product.searchQuery || null, // Use 'Product' to match the schema
        stock: product.Quantitypiece,
        Quantity: product.inputQuantity,
        Pricepay: product.Pricevent, // Ensure field name matches the schema
        total: product.total,
        Quantitypiece: product.Quantity,
        userQuantity: product.userQuantity,
        // Add other fields as necessary from your schema
      })),
    };

    console.log("Data being sent:", receptionData);

    try {
      const response = await axios.post(
        "https://www.k-orissa.com:5000/api/listLivraison",
        receptionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Livraison created successfully:", response.data);
    } catch (error) {
      // Check if error response is available
      if (error.response) {
        console.error("Error creating Livraison:", error.response.data);
      } else {
        console.error("Error creating Livraison:", error.message);
      }
    }
  };

  const fetchLastNorder = async () => {
    try {
      const response = await axios.get(
        "https://www.k-orissa.com:5000/api/listLivraison/"
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

  useEffect(() => {
    fetchLastNorder(); // Call fetchLastNorder on component mount
  }, []);

  // Fetch all suppliers from the server
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get("https://www.k-orissa.com:5000/api/suppliers"); // Adjust the API endpoint as needed
      setSuppliers(response.data);
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
          `https://www.k-orissa.com:5000/api/lisrProductSiller/search?q=${query}`
        );
        updatedProducts[productIndex].searchResults = response.data; // Set search results for the specific product
        setProducts(updatedProducts);
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
      userQuantity: "",
      total: "",
      searchQuery: product.Product, // Set the input value to the selected product's name
      searchResults: [], // Clear search results after selection
    };
    setProducts(updatedProducts);
  };

  // Add a new product row to the table
  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), userQuantity: 0, searchQuery: "", searchResults: [] },
    ]);
    resetValues(); // Optionally reset values when adding
  };



  // Remove a product row from the table
  // Remove a product row from the table
  const removeProduct = (_id) => {
    console.log("Deleting one instance of product with _id:", _id);
    console.log("Current products before deletion:", products);

    // Find the index of the first occurrence of the product with the matching _id
    const productIndex = products.findIndex((product) => product._id === _id);

    // If the product is found, remove it from the array
    if (productIndex !== -1) {
      const updatedProducts = [...products]; // Copy the products array
      updatedProducts.splice(productIndex, 1); // Remove the product at the found index

      console.log("Updated products after deletion of one instance:", updatedProducts);
      setProducts(updatedProducts); // Update the state with the modified array
      resetValues(); // Call resetValues if needed
    } else {
      console.log("Product not found for deletion.");
    }
  };

  const originalProducts = [...products]; // Store the original quantities when you initialize the component

  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  // Handle quantity input and calculate total for a product
  const handleQuantityChange = async (e, productIndex) => {
    const inputQuantity = parseInt(e.target.value);
    const updatedProducts = [...products];
    const productName = updatedProducts[productIndex].searchQuery || updatedProducts[productIndex].productName;

    try {
      // Fetch the product details using the search query to get the available quantity
      const response = await axios.get(`https://www.k-orissa.com:5000/api/lisrProductSiller/search?q=${productName}`);

      // Assuming the response contains an array of products, and we're selecting the first one
      const productData = response.data[0];
      console.log(productData);

      const currentQuantity = parseInt(productData.Quantitypiece); // Get current Quantitypiece from the database
      console.log(currentQuantity);

      // If the input field is empty, reset adjustedQuantitypiece to the original value
      if (isNaN(inputQuantity)) {
        updatedProducts[productIndex].userQuantity = 0; // Reset userQuantity if input is invalid
        updatedProducts[productIndex].adjustedQuantitypiece = currentQuantity; // Reset to original quantity in adjustedQuantitypiece
      } else {
        // Ensure the input quantity doesn't exceed the available stock
        if (inputQuantity > currentQuantity) {
          alert("Input quantity exceeds available stock!");
        } else {
          // Update the user quantity and subtract it from the available stock
          updatedProducts[productIndex].userQuantity = inputQuantity;
          const newQuantity = currentQuantity - inputQuantity;
          updatedProducts[productIndex].adjustedQuantitypiece = newQuantity; // Update only adjustedQuantitypiece
        }
      }

      // Update the products array in the state
      setProducts(updatedProducts);

      // Debugging info
      console.log("Product Index:", productIndex);
      console.log("Input Quantity:", inputQuantity);
      console.log("New Adjusted Quantity:", updatedProducts[productIndex].adjustedQuantitypiece);

      // Pass the inputQuantity to the calculateTotal function if needed
      calculateTotal(updatedProducts, productIndex, inputQuantity);

    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Calculate total for each product
  // Calculate total based on quantity and price
  const calculateTotal = (
    updatedProducts,
    productIndex,
    inputQuantity,
    priceFinal
  ) => {
    const product = updatedProducts[productIndex];

    // Print the product details and input values before calculation
    console.log('Product details:', product);
    // console.log('Product Index:', productIndex);
    // console.log('Input Quantity:', inputQuantity);
    console.log('Price Final:', priceFinal);

    const quantityForCalc = parseFloat(inputQuantity || 0); // Use the latest inputQuantity
    console.log('Quantity for Calculation:', quantityForCalc);

    const price = parseFloat(product.price || 0) || parseFloat(product.Pricevent || 0); // Get price from parameter or product
    console.log('Price used for Calculation:', price);

    const inputpiece = document.querySelectorAll('.table-input')[productIndex * 7 + 3].value || 0;
    console.log('Input Piece:', inputpiece);

    const total = quantityForCalc * inputpiece * price; // Calculate total based on input value
    console.log('Calculated Total:', total);

    updatedProducts[productIndex].total = total.toFixed(2); // Display total with 2 decimal places

    // Recalculate the General Total whenever a product total changes
    calculateGeneralTotal(updatedProducts); // Recalculate the General Total

    setProducts(updatedProducts); // Update the state with the new total
  };

  // Calculate the General Total (sum of all product totals)
  const calculateGeneralTotal = (updatedProducts) => {
    const totalSum = updatedProducts.reduce(
      (sum, product) => sum + parseFloat(product.total || 0),
      0
    );
    setGeneralTotal(totalSum.toFixed(2)); // Update General Total with 2 decimal places
  };

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
        <h1 className="title">Edit For Leverision</h1>


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
              <User size={18} className="icon" />
              <Select
                className=""
                options={supplierOptions}
                value={selectedSupplier ? supplierOptions.find(option => option.value === selectedSupplier) : null} // Default value handling
                onChange={handleChange}
                placeholder="Select Supplier"
                isSearchable
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: '#ccc', // Change this color as needed
                    borderRadius: '33px',
                    padding: '8px',
                    width: "200px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '22px',
                    width: "100%",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? '#1257f6'  // Blue when selected
                      : state.isFocused
                        ? '#1257f6'  // Light blue when focused
                        : '',        // Default background
                    color: state.isSelected ? 'white' : '', // White text for selected item
                    width: "100%",
                    transition: 'background-color 0.2s ease', // Smooth transition
                    borderRadius: '22px',  // Rounded corners with 10px radius

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
                  "Piece product",
                  "prix vent",
                  "My stock",

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
                <tr key={product.id}>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.Codebar || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.productName || product.searchQuery}
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
                            {searchProduct.Product}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={products[productIndex].userQuantity || ""}  // Bind the value to the specific product's userQuantity
                      onChange={(e) => handleQuantityChange(e, productIndex)} // Trigger handleQuantityChange on input change
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      className="table-input small-input"
                      value={products[productIndex].Quantitypiece} // Bind only original quantity here
                      readOnly // Prevent changes here
                    />
                  </td>

                  {/* Price  */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={parseFloat(product.Pricevent || product.price || 0).toFixed(2)} // Always display with two decimals
                      onChange={(e) => handlePriceChange(e, productIndex)} // Handle price changes
                      onBlur={(e) => handlePriceBlur(e, productIndex)} // Format to .00 on input blur
                    />
                  </td>
                  {/*  */}
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={products[productIndex].adjustedQuantitypiece || product.Quantitypiece || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={product.total || ""}
                      disabled
                    />
                  </td>

                  <td>
                    <button
                      onClick={() => removeProduct(product._id)}
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
            <input type="text" className="input" placeholder="Enter note" value={notev} onChange={handleNoteChange} />
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
          <button className="action-button-update" onClick={handleUpdateLeverision}>
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

export default EdiPageTablelevrision;
