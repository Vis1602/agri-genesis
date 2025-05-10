import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Farmer.css";

function FarmerCard({ img, name, title, stars, reviews }) {
  return (
    <div className="fr-card advanced-card">
      <div className="fr-card-img-container">
        <img src={img} alt={name} className="fr-card-img" />
      </div>
      <div className="fr-card-content">
        <p className="fr-card-name">{name}</p>
        <p className="fr-card-title">{title}</p>
        <p className="fr-card-stars">
          <FontAwesomeIcon
            icon={faStar}
            style={{ color: "#F7BB50", paddingRight: "6px" }}
          />
          {stars}
          <span className="fr-card-reviews"> ({reviews}+ Reviews)</span>
        </p>
      </div>
    </div>
  );
}

export default FarmerCard;
