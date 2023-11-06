import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

/////start////////
const App = () => {
  const mapElement = useRef<HTMLDivElement>(null); ////USE REF MAP ELEMENT
  const [Map, setMap] = useState<tt.Map | null>(); //// MAP STATE
  const [longitude, setLongitude] = useState<number>(78.48014548283436);
  const [latitude, setLatitude] = useState<number>(17.362464103232327);

  ////USE EFFECT FOR MAP COMPONENT ON MOUNT
  /////INTIALIZE MAP/////////////
  useEffect(() => {
    let mapInstance: tt.Map | null = null;

    /////Loading map Instance//////////
    if (mapElement.current) {
      mapInstance = tt.map({
        key: process.env.REACT_APP_TOM_TOM_API as string,
        container: mapElement.current,
        stylesVisibility: {
          trafficIncidents: true,
          trafficFlow: true,
        },
        center: [longitude, latitude],
        zoom: 14,
      });

      ///ON LOADING MAP//////////////////
      //////////POPUP///////////
      ////////Marker///////////////

      mapInstance.on("load", () => {
        setMap(mapInstance);

        ////POPUP/////////////
        const popup = new tt.Popup({
          offset: { bottom: [0, -50] },
        }).setHTML("popup");

        /////MARKER/////////
        const markerElement: HTMLDivElement = document.createElement("div");
        markerElement.className = "marker";

        const marker = new tt.Marker({
          draggable: true,
          element: markerElement,
        })
          .setLngLat([longitude, latitude])
          .addTo(mapInstance!);
        marker.on("dragend", () => {
          const lnglat = marker.getLngLat();
          setLongitude(lnglat.lng);
          setLatitude(lnglat.lat);
        });
        marker.setPopup(popup).togglePopup();
      });

      /////delivery marker/////////
      const addDeliveryMarker = (lnglat: tt.LngLat) => {
        const deliveryMarker = document.createElement("div");
        deliveryMarker.className = "markerDelivery";
        new tt.Marker({
          element: deliveryMarker,
        })
          .setLngLat(lnglat)
          .addTo(mapInstance!);
      };

      const destinations: tt.LngLat[] = [];
      mapInstance?.on("click", (e) => {
        destinations.push(e.lngLat);

        addDeliveryMarker(e.lngLat);
      });
      return () => mapInstance?.remove();
    }
  }, [latitude, longitude]);

  //////HTML ELEMENTS////////////
  return (
    <>
      <div className="App">
        <div ref={mapElement} className="map"></div>
        <div className="searchBar">
          <h4>Enter Co-ordinates</h4>
          <input
            type="text"
            id="longitude"
            className="longitude"
            placeholder="longitude"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setLongitude(value);
              } else {
                setLongitude(78.48014548283436);
              }
            }}
          />
          <input
            type="text"
            id="latitude"
            className="latitude"
            placeholder="latitude"
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setLatitude(value);
              } else {
                setLatitude(17.362464103232327);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
