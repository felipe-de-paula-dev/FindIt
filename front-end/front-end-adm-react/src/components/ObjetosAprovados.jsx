import { CalendarClock, Map, MapPin, RefreshCcw } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Filter } from "./Filter";
import { DescricaoItem } from "./DescricaoItem";
import Swal from "sweetalert2";

function formatarData(data) {
  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data inválida";
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export function ObjetosAprovados() {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationObject, setLocation] = useState("");
  const [campus, setCampusFunction] = useState("");
  const filterRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/itens/disponiveis/search?query=${search}&location=${locationObject}&campus=${campus}`
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setReload(false);
        }, 1000);
      }
    }
    fetchData();
  }, [reload, search, locationObject, campus]);

  function carregar() {
    setReload(true);
  }

  async function deletarItem(id) {
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
      const confirmationResult = await Swal.fire({
        backdrop: `
        rgba(0,0,0,0.6)
        left top
        no-repeat
      `,
        title: "Tem certeza?",
        text: "Essa ação não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar",
      });

      if (confirmationResult.isConfirmed) {
        try {
          await fetch(
            `https://findit-08qb.onrender.com/logs/excluirIdItem/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          await fetch(`https://findit-08qb.onrender.com/itens/excluir/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          setTimeout(() => {
            Swal.fire({
              backdrop: `
              rgba(0,0,0,0.6)
              left top
              no-repeat
            `,
              title: "Excluído!",
              text: "O item foi removido com sucesso.",
              icon: "success",
              timer: 4500,
              confirmButtonColor: "#696969",
            });
          }, 500);
          carregar();
        } catch (err) {
          console.error("Erro ao excluir item:", err);
          Swal.fire(
            "Erro!",
            `Falha ao excluir: ${err.message}`,
            "error",
            "confirmButtonColor: #696969"
          );
        }
      }
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

  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-8vh)] items-center flex-col">
        <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Visão Geral - Objetos Aprovados
          </h1>
          <div
            className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition active:bg-blue-100"
            onClick={() => setReload(true)}
          >
            <RefreshCcw
              className={`w-5 h-5 text-blue-600 ${
                reload ? "animate-loading" : ""
              }`}
            />
            <p className="font-semibold text-gray-800">Recarregar</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-max">
          <p className="text-gray-600 text-lg mt-6">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-8vh)] items-center flex-col">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral - Objetos Aprovados
        </h1>
        <div
          className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition active:bg-blue-100"
          onClick={() => setReload(true)}
        >
          <RefreshCcw
            className={`w-5 h-5 text-blue-600 ${
              reload ? "animate-loading" : ""
            }`}
          />
          <p className="font-semibold text-gray-800">Recarregar</p>
        </div>
      </div>

      <Filter
        ref={filterRef}
        setSearch={setSearch}
        setLocation={setLocation}
        setCampusFunction={setCampusFunction}
      />

      <div className="flex w-full h-fit justify-center overflow-y-auto p-3 mb-5 pb-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-6">
            Nenhum Objeto Encontrado.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 w-[95%] h-full mt-10">
            {data.map((item, index) => (
              <div
                className={`w-full md:w-[300px] bg-white rounded-lg border border-gray-200 shadow-lg p-4 flex flex-col gap-3 ${
                  item.campus == 1
                    ? "border-blue-300 border"
                    : "border-red-300 border"
                }`}
                key={index}
              >
                <p className="text-xl font-semibold text-gray-700">
                  <span className="text-gray-900">{item.nome_item}</span>
                </p>

                <p className="text-gray-600 text-[17px] flex items-center gap-1">
                  <CalendarClock />
                  Data:{" "}
                  <span className="font-medium text-gray-800">
                    {formatarData(item.data_encontrado)}
                  </span>
                </p>

                <p className="text-gray-600 text-[17px]  flex items-center gap-1">
                  <Map />
                  Local:{" "}
                  <span className="font-medium text-gray-800 text-nowrap">
                    {item.local_encontrado ? (
                      <DescricaoItem nome={item.local_encontrado} />
                    ) : (
                      "Carregando..."
                    )}
                  </span>
                </p>

                <p className="text-gray-600 text-[17px] flex items-center gap-2">
                  <MapPin />
                  Campus:{" "}
                  <span className="font-medium text-gray-800">
                    {item.campus == 1 ? (
                      <div className="bg-blue-200 text-blue-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                        COTIL / FT
                      </div>
                    ) : (
                      <div className="bg-red-200 text-red-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                        FCA
                      </div>
                    )}
                  </span>
                </p>

                {item.imagem_url ? (
                  <div className="w-full h-[300px] overflow-hidden rounded-md">
                    <img
                      src={item.imagem_url}
                      alt={item.nome_item}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Sem imagem disponível</p>
                )}

                <div className="flex flex-col gap-2 w-full mt-3">
                  <button
                    className="bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-600"
                    onClick={() => {
                      deletarItem(item.id_item);
                    }}
                  >
                    Excluir Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
