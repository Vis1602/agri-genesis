import React from "react";
import InformationCard from "./InformationCard";
import "../Styles/Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
        At Agrigenesis, we empower farmers by providing a comprehensive suite of tools and services designed to enhance agricultural productivity and sustainability. Our platform connects farmers with experts, facilitates crop exchange and direct selling, and offers tailored advice to help you make informed decisions about your farm.
        </p>
      </div>

      <div className="info-cards-content">
        <InformationCard
          title="Expert Consultations"
          description="Book live consultations with agricultural experts to get solutions to specific challenges you face on your farm. Receive customized recommendations on crop selection, pest control, irrigation, and soil management based on your farm's unique needs."
        />

        <InformationCard
          title="Smart Tools"
          description="Smart Tools: Utilize our interactive tools, such as crop calendars, weather updates, and dosage calculators, to manage your farm more efficiently and sustainably."
        />

        <InformationCard
          title="Community Engagement"
          description="Join a vibrant community of farmers to share experiences, discuss challenges, and learn from each other through our forums and knowledge base."
        />
      </div>
    </div>
  );
}

export default Info;
