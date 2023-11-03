import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

// import tt, { MapOptions } from "@tomtom-international/web-sdk-maps";

// type Map = {
//   remove(): void;
// };

/////start////////
const App = () => {
  const mapElement = useRef<HTMLDivElement>(null); ////USE REF MAP ELEMENT
  const [map, setMap] = useState({}); //// MAP STATE
  const [longitude, setLongitude] = useState<number>(78.48014548283436);
  const [latitude, setLatitude] = useState<number>(17.362464103232327);

  ////USE EFFECT FOR MAP COMPONENT ON MOUNT
  /////INTIALIZE MAP
  useEffect(() => {
    if (mapElement.current) {
      let map = tt.map({
        key: process.env.REACT_APP_TOM_TOM_API as string,
        container: mapElement.current,
        stylesVisibility: {
          trafficIncidents: true,
          trafficFlow: true,
        },
        center: [longitude, latitude],
        zoom: 14,
      });
    }
    setMap(map);
  }, [latitude, longitude]);

  //////HTML ELEMENTS////////////
  return (
    <div className="App">
      <div ref={mapElement} className="map"></div>
      <div className="searchBar">
        <h4>Enter Co-ordinates</h4>
        <input
          type="text"
          id="longitude"
          className="longitude"
          onChange={(e) => {
            if (!isNaN(parseFloat(e.target.value))) {
              setLongitude(78.48014548283436);
            }

            setLongitude(parseFloat(e.target.value));
          }}
        />
        <input
          type="text"
          id="latitude"
          className="latitude"
          onChange={(e) => {
            if (!isNaN(parseFloat(e.target.value))) {
              setLatitude(17.362464103232327);
            }
            setLatitude(parseFloat(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default App;
