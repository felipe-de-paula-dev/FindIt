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
              `https://findit-08qb.onrender.com/api/deletarLocal/${id}`,
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
          `https://findit-08qb.onrender.com/api/campus/${campus}`,
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
    <div className="w-full flex flex-col items-center overflow-y-auto h-[calc(100vh-8vh)]  px-6 py-8">
      <div className="w-[95%]  border-b pb-4 border-gray-300  flex justify-between items-center  px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Todos Os Locais
        </h1>
        <div
          className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition active:bg-blue-100"
          onClick={() => {
            setReload(true);
          }}
        >
          <RefreshCcw
            className={`w-5 h-5 text-blue-600 ${
              reload ? "animate-loading" : ""
            }`}
          />
          <p className="font-semibold text-gray-800">Recarregar</p>
        </div>
      </div>
      <div className="flex bg-slate-50 shadow w-[95%] h-[500px] mt-5">
        <div className="w-[45%] bg-slate-50 p-3 h-[500px] flex flex-col gap-1 overflow-auto">
          <div className="flex w-full justify-evenly p-2 text-xl gap-4">
            <button
              className={`rounded-[15px] border-slalte-400 border w-full h-full py-1shadow text-center ${
                campus == 1
                  ? "bg-blue-200 text-blue-600 "
                  : "bg-slate-100 text-black"
              }`}
              onClick={() => setCampus(1)}
            >
              Campus 1
            </button>
            <button
              className={`rounded border-slalte-400 border w-full h-full py-1shadow text-center ${
                campus == 2
                  ? "bg-blue-200 text-blue-600"
                  : "bg-slate-100 text-black"
              }`}
              onClick={() => setCampus(2)}
            >
              Campus 2
            </button>
          </div>
          {campusOptions.length > 0 ? (
            campusOptions.map((campus, index) => (
              <button
                key={index}
                onClick={() => setDescricao(campus.descricao)}
                className={`rounded border-slate-200 border w-full h-full py-1 p-1 shadow text-left ${
                  descricao === campus.descricao
                    ? "bg-blue-200 text-blue-700"
                    : ""
                } flex items-center justify-between`}
              >
                {campus.descricao}
                <button >
                  <Trash2
                    strokeWidth={1}
                    className="text-red-600 scale-105 hover:scale-110 transform transition-all"
                    onClick={() => deletarLocal(campus.id)}
                  />
                </button>
              </button>
            ))
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        <div className="map w-full h-full">
          <MapComponent descricao={descricao} campus={campus} />
        </div>
      </div>
    </div>
  );
}
