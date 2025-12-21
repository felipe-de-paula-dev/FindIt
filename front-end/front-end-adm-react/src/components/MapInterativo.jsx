/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapInterativo = ({ descricao, campus, latLng }) => {
  const [position, setPosition] = useState([
    -22.562212692166504, -47.42416030376162,
  ]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  function enviarDados(lat, lng) {
    latLng({ latitude: lat, longitude: lng });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://finditapi.felipedepauladev.site/api/campusDesc/${descricao}?campus=${campus}`
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
      mapRef.current = L.map("mapa", {
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        touchZoom: true,
      }).setView(position, 19);

      mapRef.current.attributionControl.setPrefix("By Felipe De Paula");

      markerRef.current = L.marker(position)
        .addTo(mapRef.current)
        .bindPopup("Local Inicial");

      L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "&copy; Google Maps",
      }).addTo(mapRef.current);

      mapRef.current.on("click", (e) => {
        const latlng = e.latlng;

        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = L.marker(latlng).addTo(mapRef.current);

        enviarDados(latlng.lat, latlng.lng);
      });
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

  return <div id="mapa" style={{ height: "100%", width: "100%" }}></div>;
};

export default MapInterativo;
