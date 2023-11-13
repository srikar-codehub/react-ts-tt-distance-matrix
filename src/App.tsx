import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import * as tt from "@tomtom-international/web-sdk-maps";

import "@tomtom-international/web-sdk-maps/dist/maps.css";

/////start////////
const App = () => {
  const mapElement = useRef<HTMLDivElement>(null); ////USE REF MAP ELEMENT
  const [Map, setMap] = useState<tt.Map | null>(); //// MAP STATE
  const [longitude, setLongitude] = useState<number>(78.48014548283436);
  const [latitude, setLatitude] = useState<number>(17.362464103232327);
  const [locationMode, setLocationMode] = useState<string>("Origins");
  const [origins, setOrigins] = useState<Point[]>([]);
  const [destinations, setDestinations] = useState<Point[]>([]);
  // const [deliveryMarker, setDeliveryMarker] = useState<tt.LngLat[] | null>();
  type Point = {
    point: {
      longitude: number;
      latitude: number;
    };
  };

  const convertToPoints = (lat: number, lng: number): Point => {
    return {
      point: {
        longitude: lng,
        latitude: lat,
      },
    };
  };

  const sendDataRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const dataToSend = {
      origins: origins,
      destinations: destinations,
    };
    try {
      const response = await fetch(
        `https://api.tomtom.com/routing/matrix/2?key=${process.env.REACT_APP_TOM_TOM_API}`,
        {
          method: "POST",
          body: JSON.stringify(dataToSend),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      const data = await response.json();
      const routes = data.data;
      console.log(data);
      console.log(routes);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

      //////////ON LOADING MAP//////////////////
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

      mapInstance?.on("click", (e) => {
        addDeliveryMarker(e.lngLat);

        const { lat, lng } = e.lngLat;
        const point = convertToPoints(lat, lng);
        if (locationMode === "Destinations") {
          setDestinations((destinations) => [...destinations, point]);
          console.log(destinations);
        } else if (locationMode === "Origins") {
          setOrigins((origins) => [...origins, point]);
          console.log(origins);
        }
      });
      return () => mapInstance?.remove();
    }
  }, [latitude, longitude, locationMode, origins, destinations]);

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
          <button
            type="button"
            onClick={(e) => {
              if (locationMode === "Origins") {
                setLocationMode("Destinations");
              } else if (locationMode === "Destinations") {
                setLocationMode("Origins");
              }
            }}
          >{`MODE:${locationMode}`}</button>
          <button type="button" onClick={sendDataRequest}>
            Selected all Points
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
