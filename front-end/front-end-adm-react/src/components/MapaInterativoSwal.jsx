import { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPlus } from "lucide-react";

export function MapaInterativoSwal() {
  const [position, setPosition] = useState([0, 0]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [zoom, setZoom] = useState(19);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [campus, setCampus] = useState(0);
  const local = useRef({ latitude: 0, longitude: 0 });

  async function setarNomeDescricao() {
    const token = sessionStorage.getItem("token");
    const responseToken = await fetch(
      "https://findit-08qb.onrender.com/auth-enter",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const dataToken = await responseToken.json();
    if (dataToken.cargoId.cargoId == 1 || dataToken.cargoId.cargoId == 3) {
      Swal.fire({
        title: "Digite o nome do Local",
        html: '<input id="nome" type="text" maxlength="25" placeholder="Digite o nome aqui..." class="w-[80%] m-auto pl-4 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#006400",
        cancelButtonColor: "#696969",
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          const text = document.getElementById("nome").value.trim();
          if (text !== "") {
            setNome(text.toLowerCase());
            setDescricao(text);
            adicionarLocal();
          } else {
            Swal.fire({
              icon: "warning",
              title: "Nome não pode estar vazio!",
              timer: 2500,
              confirmButtonColor: "#696969",
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Este usuário não possui permissão para acessar esta área. Por favor, entre em contato com o administrador.",
        confirmButtonText: "Entendi",
        confirmButtonColor: "#696969",
      });
    }
  }

  function adicionarLocal() {
    Swal.fire({
      imageUrl:
        "https://icones.pro/wp-content/uploads/2021/04/icones-de-localisation-de-la-carte-noire.png",
      imageWidth: 200,
      imageHeight: "auto",
      title: "Selecione um Campus",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Campus 1 - Cotil | FT",
      denyButtonText: "Campus 2 - FCA",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#B22222",
      denyButtonColor: "#1E90FF",
      cancelButtonColor: "#696969",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        setCampus(1);
        setZoom(17);
        setPosition([-22.562212, -47.42416]);
      } else if (resultado.isDenied) {
        setCampus(2);
        setZoom(16);
        setPosition([-22.555197, -47.428991]);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Você não selecionou nenhum campus!",
          timer: 2500,
          confirmButtonColor: "#696969",
        });
      }
    });
  }

  const addLocate = useCallback(
    async (novoLocal) => {
      try {
        const data = { nome, descricao, localizacao: novoLocal, campus };
        const res = await fetch(
          "https://findit-08qb.onrender.com/api/adicionarLocal",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (!res.ok) throw new Error("Erro na requisição");
        Swal.fire({
          icon: "success",
          title: "Local Adicionado!",
          timer: 2000,
          confirmButtonColor: "#696969",
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Erro ao adicionar o local",
          timer: 2000,
        });
      }
    },
    [campus, descricao, nome]
  );

  useEffect(() => {
    if (position[0] === 0 && position[1] === 0) return;
    let latlng;
    Swal.fire({
      title: "Mapa Interativo",
      html: '<div id="mapaAdd" style="width: 100%; height: 400px;"></div>',
      width: 800,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#B22222",
      confirmButtonText: "Confirmar Local",
      confirmButtonColor: "#228B22",
      didOpen: () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
        mapRef.current = L.map("mapaAdd", {
          zoomControl: true,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          touchZoom: false,
        }).setView(position, zoom);

        mapRef.current.attributionControl.setPrefix("By Felipe De Paula");

        L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}").addTo(
          mapRef.current
        );

        markerRef.current = L.marker(position)
          .addTo(mapRef.current)
          .bindPopup("Local Inicial");

        mapRef.current.on("click", (e) => {
          latlng = e.latlng;
          const novoLocal = { latitude: latlng.lat, longitude: latlng.lng };
          local.current = novoLocal;
          if (markerRef.current) markerRef.current.remove();
          markerRef.current = L.marker(latlng).addTo(mapRef.current);
        });
      },
    }).then((Response) => {
      if (Response.isConfirmed) addLocate(local.current);
      else {
        Swal.fire({
          icon: "warning",
          title: "Você não selecionou nenhum Local!",
          timer: 2500,
          confirmButtonColor: "#696969",
        });
      }
    });
  }, [position, zoom, addLocate]);

  return (
    <button
      onClick={setarNomeDescricao}
      className="space-y-6 font-normal text-[15px] flex items-center gap-2 w-full pl-4 p-2 hover:cursor-pointer"
    >
      <MapPlus size={20} /> Adicionar Local
    </button>
  );
}
