/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

export function Map({ campusUnicamp }) {
  const [loading, setLoading] = useState(true);
  const [localEncontrado, setLocalEncontrado] = useState(null);
  const [campus, setCampus] = useState(0);
  const [mapa, setMapa] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const [typeMessage, setTypeMessage] = useState("");
  const [messageBox, setMessageBox] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (campus == 0) return;
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/api/campus/${campus}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (err) {
        console.log("Ocorreu um erro:", err);
      }
    }
    fetchData();
  }, [campus]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/mapa/${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setLocalEncontrado(data[0].local_encontrado.toLowerCase());
        setCampus(data[0].campus);
        campusUnicamp(data[0].campus);
      } catch (err) {
        console.error("Erro ao buscar o mapa:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    console.log(localEncontrado);
  }, [localEncontrado]);

  useEffect(() => {
    CreateMap(localEncontrado);
  }, [data]);

  function CreateMap(Mapa) {
    let localEncontrado;
    let locais = 0;

    console.log(locais);

    const objetoEncontrado = data.find((objeto) => objeto.nome.includes(Mapa));

    console.log(data);
    console.log(Mapa);
    console.log(objetoEncontrado);

    if (objetoEncontrado == undefined) {
      if (campus == 1) {
        localEncontrado = [-22.562424, -47.425008];
      } else if (campus == 2) {
        localEncontrado = [-22.55581914093393, -47.42948548947745];
      }
      setShowMessage(true);
      setMessageBox("Local Não Encontrado");
      setTypeMessage("err");
    } else {
      const { latitude, longitude } = objetoEncontrado;
      localEncontrado = [latitude, longitude];
      setTypeMessage("success");
      setShowMessage(true);
      setMessageBox("Local Encontrado");
    }

    let retirada;

    if (campus == 1 || campus == 0) {
      retirada = [-22.562424, -47.425008];
    } else if (campus == 2) {
      retirada = [-22.55581914093393, -47.42948548947745];
    }

    if (mapa) {
      mapa.remove();
    }

    const mapContainer = document.getElementById("mapa");

    if (mapContainer && !mapa) {
      const map = L.map("mapa", {
        zoomControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
      });

      map.setView(localEncontrado, 15);

      map.attributionControl.setPrefix("By Felipe De Paula");

      L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        attribution: "&copy; Google Maps",
      }).addTo(map);

      const iconeAlfinete = L.icon({
        iconUrl: "https://i.imgur.com/ig0b9hc.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const iconeRetirada = L.icon({
        iconUrl: "https://i.imgur.com/qmzZ24l.png",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
      });

      L.marker(localEncontrado, { icon: iconeAlfinete }).addTo(map);

      L.marker(retirada, { icon: iconeRetirada }).addTo(map);

      const bounds = new L.LatLngBounds(localEncontrado, retirada);

      map.fitBounds(bounds, {
        padding: [50, 50],
      });

      const legenda = L.control({ position: "bottomleft" });

      legenda.onAdd = function () {
        const div = L.DomUtil.create("div", "legenda");
        div.innerHTML = `
    <strong>Legenda</strong><br>
    <span style="display: inline-flex; align-items: baseline; margin-bottom: 5px;">
        <img src="https://i.imgur.com/ig0b9hc.png" width="20" style="margin-top:7px; margin-right: 5px;">
        Item Encontrado
    </span>
    <br>
    <span style="display: inline-flex; align-items: center;">
        <img src="https://i.imgur.com/qmzZ24l.png" width="20" style="margin-right: 5px;">
        Local de Retirada
    </span>
`;

        div.style.backgroundColor = "white";
        div.style.padding = "8px";
        div.style.boxShadow =
          "box-shadow: 10px 10px 17px -3px rgba(0,0,0,0.75)";
        div.style.fontSize = "14px";
        div.style.whiteSpace = "nowrap";
        return div;
      };

      legenda.addTo(map);
      setMapa(map);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-4 text-center w-full">
        <div className="w-[95%] border-t border-slate-300 mb-5"></div>
        <h1 className="text-4xl font-[600]">Local Do Seu Item</h1>
        <p className="text-[17px] my-3">
          Retire Seu Item Preenchendo o formulario{" "}
          <span className="text-red-600 font-semibold">abaixo</span>
        </p>
        <div className="w-full h-[563px] flex justify-center items-center">
          <LoaderCircle size={96} className="animate-loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-4 text-center w-full max-w-[1200px] mx-auto px-4">
      <div className="w-full border-t border-slate-300 mb-6"></div>
      <h1 className="text-4xl font-semibold text-gray-800">
        Local do Seu Item
      </h1>
      <p className="text-lg text-gray-700 my-3">
        Retire seu item preenchendo o formulário{" "}
        <span className="text-red-600 font-semibold">abaixo</span>
      </p>

      <div
        id="mapa"
        style={{ width: "100%", height: "50vh" }}
        className="rounded-xl overflow-hidden shadow-lg border border-gray-300 z-10"
      />

      {showMessage && (
        <p
          className={`mt-8 text-lg font-semibold px-6 py-3 rounded-xl shadow-md animate-fadeIn ${
            typeMessage === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {messageBox}
        </p>
      )}
    </div>
  );
}
