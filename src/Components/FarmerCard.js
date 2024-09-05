import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function FarmerCard(props) {
  return (
    <div className="fr-card">
      <img src={props.img} alt={props.name} className="fr-card-img" />
      <p className="fr-card-name">{props.name}</p>
      <p className="fr-card-title">{props.title}</p>
      <p className="fr-card-stars">
        <FontAwesomeIcon
          icon={faStar}
          style={{ color: "#F7BB50", paddingRight: "6px" }}
        />
        {props.stars}
        <span className="fr-card-reviews"> ({props.reviews}+ Reviews)</span>
      </p>
    </div>
  );
}

export default FarmerCard;
