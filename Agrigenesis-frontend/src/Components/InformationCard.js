import React from "react";
function InformationCard(props) {
  return (
    <div className="info-cards">
      <p className="info-card-title">{props.title}</p>
      <p className="info-card-description">{props.description}</p>
    </div>
  );
}

export default InformationCard;
