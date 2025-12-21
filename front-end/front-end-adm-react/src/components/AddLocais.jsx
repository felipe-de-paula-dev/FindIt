import { useEffect, useState } from "react";
import { RefreshCcw, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import MapComponent from "./MapComponent";

export function AddLocais() {
  const [reload, setReload] = useState(false);
  const [campusOptions, setCampusOptions] = useState([]);
  const [campus, setCampus] = useState(1);
  const [descricao, setDescricao] = useState("Salas De Aula");

  async function deletarLocal(id) {
    const token = sessionStorage.getItem("token");
    const responseToken = await fetch(
      "https://finditapi.felipedepauladev.site/auth-enter",
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
        icon: "warning",
        title: "Você Deseja Deletar O Local?",
        text: "Essa ação é irreversivel!",
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#696969",
        confirmButtonColor: "#B22222",
        confirmButtonText: "Deletar",
      }).then((response) => {
        if (response.isConfirmed) {
          try {
            const response = fetch(
              `https://finditapi.felipedepauladev.site/api/deletarLocal/${id}`,
              {
                method: "DELETE",
              }
            );
            if (response) {
              Swal.fire({
                icon: "success",
                title: "Local Deletado Com Sucesso!",
                timer: 2000,
                confirmButtonColor: "#696969",
              });
            }
            setReload(true);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Não Foi Possivel Deletar",
              text: error,
              timer: 2000,
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
      });
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://finditapi.felipedepauladev.site/api/campus/${campus}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        setCampusOptions(data);
      } catch (err) {
        console.log("Ocorreu um erro:", err);
      }
    }
    fetchData();
  }, [campus, reload]);

  useEffect(() => {
    setTimeout(() => {
      setReload(false);
    }, 2000);
  }, [reload, setReload]);

  return (
    <div className="w-full flex flex-col items-center overflow-y-auto h-[calc(100vh-8vh)] px-6 py-8 bg-gray-50">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold text-gray-800">Todos os Locais</h1>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition active:bg-blue-100 border"
          onClick={() => setReload(true)}
        >
          <RefreshCcw
            className={`w-5 h-5 text-blue-600 ${reload ? "animate-spin" : ""}`}
          />
          <p className="font-medium text-gray-800">Recarregar</p>
        </div>
      </div>

      <div className="flex bg-white shadow-md rounded-xl w-[95%] h-[500px] mt-6 overflow-hidden">
        <div className="w-[45%] bg-gray-50 p-4 flex flex-col gap-3 overflow-auto border-r">
          <div className="flex gap-3">
            <button
              className={`flex-1 rounded-lg py-2 text-sm font-semibold shadow transition ${
                campus === 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
              onClick={() => setCampus(1)}
            >
              Campus 1
            </button>
            <button
              className={`flex-1 rounded-lg py-2 text-sm font-semibold shadow transition ${
                campus === 2
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
              onClick={() => setCampus(2)}
            >
              Campus 2
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {campusOptions.length > 0 ? (
              campusOptions.map((campus, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg border shadow-sm transition cursor-pointer ${
                    descricao === campus.descricao
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setDescricao(campus.descricao)}
                >
                  <span className="text-sm font-medium">
                    {campus.descricao}
                  </span>
                  <Trash2
                    strokeWidth={1}
                    className="text-red-600 hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletarLocal(campus.id);
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Carregando locais...</p>
            )}
          </div>
        </div>

        <div className="map w-full h-full">
          <MapComponent descricao={descricao} campus={campus} />
        </div>
      </div>
    </div>
  );
}
