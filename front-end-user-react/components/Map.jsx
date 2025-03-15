/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import L from "leaflet";
import { useLocation } from "react-router-dom";

export function Map() {
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3333/mapa/${id}`, {
          method: "GET",
        });
        const data = await response.json();
        setLocalEncontrado(data[0].local_encontrado.toLowerCase());
        setCampus(data[0].campus);
      } catch (err) {
        console.error("Erro ao buscar o mapa:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading && localEncontrado !== null && !mapa) {
      CreateMap(localEncontrado);
    }
  }, [loading, localEncontrado]);

  function CreateMap(Mapa) {
    const campus1 = {
      sala: [-22.562426, -47.425279],
      biblioteca: [-22.562178, -47.423553],
      portaria1: [-22.56258826525875, -47.42350342386182],
      portaria2: [-22.561311457413293, -47.42352302262576],
      rucotil: [-22.561948507540837, -47.42510397673924],
      patio: [-22.562397644064124, -47.425140851896494],
      faculdade: [-22.561941990488954, -47.423929602715695],
      outro: [-22.562424, -47.425008],
    };

    const campus2 = {
      sala: [-22.55541486085191, -47.42898455670213],
      labmateriais: [-22.554583709662193, -47.429902189883435],
      labdisturbios: [-22.55439154782403, -47.43015133475157],
      biblioteca: [-22.55538621602273, -47.42985167033761],
      congregacao: [-22.555596248707783, -47.429172956810454],
      portaria1: [-22.557460810429514, -47.42971757993756],
      portaria2: [-22.557276242457565, -47.4266802410635],
      portariacarros: [-22.55403412154558, -47.431491385961706],
      rurestaurante: [-22.55443107835698, -47.42888029249364],
      patio: [-22.55561936784757, -47.42950863720489],
      outro: [-22.55581914093393, -47.42948548947745],
    };

    let localEncontrado;
    let locais = 0;

    if (campus == 1) {
      locais = campus1;
    } else if (campus == 2) {
      locais = campus2;
    }

    console.log(locais)

    if (!Object.keys(locais).includes(Mapa)) {
      if (campus == 1) {
        localEncontrado = [-22.562424, -47.425008];
      } else if (campus == 2) {
        localEncontrado = [-22.55581914093393, -47.42948548947745];
      }
      setShowMessage(true);
      setMessageBox("Local Não Encontrado");
      setTypeMessage("err");
    } else {
      localEncontrado = locais[Mapa];
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
      const novoMapa = L.map("mapa").setView(localEncontrado, 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(novoMapa);

      const iconeAlfinete = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const iconeCasa = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
      });

      L.marker(localEncontrado, { icon: iconeAlfinete })
        .addTo(novoMapa)
        .bindPopup(`<b>Item Encontrado Aqui!</b>`);

      L.marker(retirada, { icon: iconeCasa })
        .addTo(novoMapa)
        .bindPopup("<b>Local de Retirada</b>");

      const legenda = L.control({ position: "bottomleft" });

      legenda.onAdd = function () {
        const div = L.DomUtil.create("div", "legenda");
        div.innerHTML = `
    <strong>Legenda</strong><br>
    <span style="display: inline-flex; align-items: center; margin-bottom: 5px;">
        <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" width="20" style="margin-top:7px; margin-right: 5px;">
        Item Encontrado
    </span>
    <br>
    <span style="display: inline-flex; align-items: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/484/484167.png" width="20" style="margin-right: 5px;">
        Local de Retirada
    </span>
`;

        div.style.backgroundColor = "white";
        div.style.padding = "8px";
        div.style.border = "1px solid black";
        div.style.borderRadius = "5px";
        div.style.fontSize = "14px";
        div.style.whiteSpace = "nowrap";
        return div;
      };

      legenda.addTo(novoMapa);
      setMapa(novoMapa);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center mt-4 text-center w-full">
      <div className="w-[95%] border-t border-slate-300 mb-5"></div>
      <h1 className="text-4xl font-[600]">Local Do Seu Item</h1>
      <p className="text-[17px] my-3">
        Retire Seu Item Preenchendo o formulario{" "}
        <span className="text-red-600 font-semibold">abaixo</span>
      </p>
      <div
        id="mapa"
        style={{ width: "99.99%", height: "50vh" }}
        className="rounded-md z-10"
      />
      {showMessage && (
        <p
          className={`text-white font-semibold mt-8 text-xl  p-4 rounded z-50 ${
            typeMessage == "success"
              ? "bg-green-500 text-green-500"
              : "bg-red-500 text-red-500"
          }`}
        >
          {messageBox}
        </p>
      )}
    </div>
  );
}
