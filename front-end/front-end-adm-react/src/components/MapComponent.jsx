/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapComponent = ({ descricao, campus }) => {
  const [position, setPosition] = useState([
    -22.562212692166504, -47.42416030376162,
  ]);
  const mapRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/api/campusDesc/${descricao}?campus=${campus}`
        );
        const data = await response.json();
        if (data[0]?.latitude && data[0]?.longitude) {
          setPosition([data[0].latitude, data[0].longitude]);
        }
      } catch (err) {
        console.log("Ocorreu um erro:", err);
      }
    }

    if (descricao) {
      fetchData();
    }
  }, [descricao, campus]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("mapaComponente", {
        zoomControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
      }).setView(position, 19);

      mapRef.current.attributionControl.setPrefix("By Felipe De Paula");

      L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "&copy; Google Maps",
      }).addTo(mapRef.current);

      const iconeAlfinete = L.icon({
        iconUrl: "https://i.imgur.com/ig0b9hc.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      L.marker(position, { icon: iconeAlfinete }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(position, 19);
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      const iconeAlfinete = L.icon({
        iconUrl: "https://i.imgur.com/ig0b9hc.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      L.marker(position, { icon: iconeAlfinete }).addTo(mapRef.current);
    }
  }, [position]);

  return (
    <div id="mapaComponente" style={{ height: "100%", width: "100%" }}></div>
  );
};

export default MapComponent;
