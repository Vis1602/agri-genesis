import React from "react";
import FarmerCard from "./FarmerCard";
import profile1 from "../Assets/profile-1.jpg";
import profile2 from "../Assets/profile-2.jpg";
import profile3 from "../Assets/profile-3.jpg";
import profile4 from "../Assets/profile-4.jpg";
import "../Styles/Farmer.css";

function Farmer() {
  return (
    <div className="farmer-section" id="farmer">
      <div className="fr-title-content">
        <h3 className="fr-title">
          <span>Meet Our Experts</span>
        </h3>

        <p className="fr-description">
          Meet our exceptional team of specialist, dedicated to
          providing top-notch advisory services at Agrigenesis. Trust in their
          knowledge and experience to lead you towards a Profitable and Good
          crops.
        </p>
      </div>

      <div className="fr-cards-content">
        <FarmerCard
          img={profile1}
          name="Bharti singh"
          title="Crop Consultant"
          stars="4.9"
          reviews="180"
        />
        <FarmerCard
          img={profile2}
          name="Komal Desai"
          title="pestologists"
          stars="4.8"
          reviews="70"
        />
        <FarmerCard
          img={profile3}
          name="Darsh shah"
          title="Irrigation Specialist"
          stars="4.7"
          reviews="45"
        />
        <FarmerCard
          img={profile4}
          name="Vinay mittal"
          title="Seed production Speciaist"
          stars="4.8"
          reviews="50"
        />
      </div>
    </div>
  );
}

export default Farmer;
