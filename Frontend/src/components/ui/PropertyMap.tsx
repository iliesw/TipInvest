import React from "react";
import "leaflet/dist/leaflet.css";
const PropertyMap = ({
  location,
}:{
  location: {
    x: number;
    y: number;
  };
}) => {

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <iframe
        width="600"
        height="500"
        id="gmap_canvas"
        src={`https://maps.google.com/maps?q=${location.x}%20${location.y}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
        className="w-full"
      ></iframe>
    </div>
  );
};

export default PropertyMap;
