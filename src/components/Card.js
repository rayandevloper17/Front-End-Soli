import React from "react";
import "./CSs/Cards.css";

const Card = ({ image, namebutton, click, backgroundColor, className }) => {
  return (
    <div className={className} onClick={click} style={{ backgroundColor }}>
      
      
      <img src={image} alt={namebutton} className="card-icon" />
      <br/>
      <br/>
      <h3>{namebutton}</h3>
  
      <button>{namebutton}</button>
    </div>
  );
};


export default Card;
