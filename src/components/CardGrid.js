import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Card from "./Card";
import image1 from "../images/homefinal.svg"; // Import the image file
import homefinal from "../images/truck1.svg"; // Import the image file
import statistick from "../images/statistisc.svg"; // Import the image file
import basketshope from "../images/basketshope.svg"; // Import the image file
import versment from "../images/versment.svg"; // Import the image file
import transaction from "../images/transaction.svg"; // Import the image file


import sell from "../images/sell.svg"; // Import the image file
import doc from "../images/doc.svg"; // Import the image file
import listruck from "../images/listruck.svg"; // Import the image file
import Orders from "../images/orders.svg"; // Import the image file

import adduser from "../images/adduser.svg"; // Import the image file
import users from "../images/users.svg"; // Import the image file
import addproduct from "../images/add_product.svg"; // Import the image file
import products from "../images/products.svg"; // Import the image file

import vendor from "../images/vendor.svg"; // Import the image file
import persons from "../images/persons.svg"; // Import the image file




import "./CSs/CardGrid.css";
const cardsData = [
  {
    image: image1,
    namebutton: "Bon de réception",
    path: "/productReceptionForm",
    className: "card",
    backgroundColor: "#5898eb",
  },
  {
    image: homefinal,
    namebutton: "Charger Une Camionnette",
    path: "/charger-camionnette",
    className: "card",
    backgroundColor: "#5898eb",
  },
  {
    image: basketshope,
    namebutton: "Ajouter une commande",
    path: "/ajouter-commande",
    className: "card",
    backgroundColor: "#5898eb",
  },
  {
    image: sell,
    namebutton: "Bon de livraison",
    path: "/ProductLeverision",
    className: "card",
    backgroundColor: "#5898eb",
  },


  {
    image: doc,
    namebutton: "ListReceptionProducts",
    path: "/ListSoldProducts",
    className: "card",
    backgroundColor: "#47bde6",
  },
  {
    image: listruck,
    namebutton: "Liste des camions",
    path: "/some-path-4",
    className: "card",
    backgroundColor: "#47bde6",
  },
  {
    image: Orders,
    path: "/circle-path",
    namebutton: "toutes les commandes",
    className: "commandescard",
    backgroundColor: "#47bde6",
  },
  {
    image: statistick,
    namebutton: "Statistic",
    path: "/statisticsPage",
    className: "cardciciler",
  },
  {
    image: doc,
    namebutton: "ListVersionProductsTable",
    path: "/ListVersionProductsTable",
    className: "commandescard",
    backgroundColor: "#47bde6",
  },
  {
    image: adduser,
    namebutton: "Ajouter un client",
    path: "/addUser",
    className: "card",
    backgroundColor: "#e8b025",

  },
  {
    image: addproduct,
    namebutton: "Ajouter un product",
    path: "/ProductForm",
    className: "card",
    backgroundColor: "#e8b025",

  },
  {
    image: vendor,
    namebutton: "Comptable",
    path: "/some-path-3",
    className: "card",
    backgroundColor: "#e8b025",

  },
  {
    image: versment,
    namebutton: "Transferts",
    path: "/soluStock",
    className: "card",
    backgroundColor: "#e8b025",

  },
  {
    image: users,
    namebutton: "tous les clients",
    path: "/SupplierTable",
    className: "card",
    backgroundColor: "#45ccaa",
  },
  {
    image: products,
    namebutton: "ListProduct",
    path: "/ListSoldProductsall",
    className: "card",
    backgroundColor: "#45ccaa",
  },
  {
    image: persons,
    namebutton: "Liste des factures ",
    path: "/SupplierTable",
    className: "card",
    backgroundColor: "#45ccaa",
  },
  {
    image: transaction,
    namebutton: "Toutes les opérations",
    path: "/PaymentList",
    className: "card",
    backgroundColor: "#45ccaa",
  },
];

const CardGrid = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="card-grid">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          image={card.image}
          title={card.title}
          namebutton={card.namebutton}
          click={() => handleCardClick(card.path)}
          backgroundColor={card.backgroundColor}
          className={`card ${card.className}`} // Combine base 'card' with unique class
        />
      ))}
    </div>
  );
};

export default CardGrid;
