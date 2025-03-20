import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Filter } from "./Filter";

export function RetiradaDeObjetos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");
  const [locationObject, setLocation] = useState("");
  const [campus, setCampusFunction] = useState("");
  const filterRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/retirada/search?query=${search}&location=${locationObject}&campus=${campus}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setReload(false);
        }, 1000);
      }
    }
    fetchData();
  }, [reload, search, locationObject, campus]);
  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-8vh)]  items-center flex-col">
        <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Visão Geral - Retirada de Objetos
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
        <div className="flex items-center justify-center h-max">
          <p className="text-gray-600 mt-6 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  async function handleAction(action, id) {
    try {
      let response;
      if (action === "deletar") {
        const result = await Swal.fire({
          title: "Você tem certeza?",
          text: "Esta ação não pode ser desfeita!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sim, excluir",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          await fetch(
            `https://findit-08qb.onrender.com/retirada/excluir/${id}`,
            {
              method: "DELETE",
            }
          );
          Swal.fire({
            icon: "success",
            title: "Deletado!",
            text: "A retirada foi rejeitada com sucesso.",
          });
          setReload(true);
        }
      } else if (action === "aprovar") {
        const result = await Swal.fire({
          title: "Você tem certeza?",
          text: "Deseja aprovar esta retirada?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sim, aprovar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          response = await fetch(
            `https://findit-08qb.onrender.com/retirada/aprovar/${id}`,
            {
              method: "PUT",
            }
          );
          if (!response.ok) {
            console.error("Erro Ao Aprovar Retirada");
            Swal.fire({
              icon: "error",
              title: "Erro",
              text: "Ocorreu um erro ao aprovar a retirada.",
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Aprovado!",
              text: "A retirada foi aprovada com sucesso.",
            });
            setReload(true);
          }
        }
      }
    } catch (error) {
      console.error(`Erro ao ${action} retirada:`, error);
    }
  }

  return (
    <div className="flex w-full h-[calc(100vh-8vh)]  items-center flex-col">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral - Retirada de Objetos
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

      <div className="flex w-full h-fit  justify-center overflow-y-auto p-3 mb-5 pb-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 text-lg">
            Nenhum Objeto Encontrado.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 w-[95%] h-full mt-10">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 w-[250px] h-fit sm:w-[300px] bg-white rounded-lg border border-gray-200 shadow-lg p-3"
              >
                <div className="w-full">
                  <p className="text-[16px] font-semibold text-gray-700">
                    Nome Objeto: {item.nomeObjeto}
                  </p>
                  <p className="text-[16px] text-gray-600">
                    <strong>Nome:</strong> {item.nome}
                  </p>
                  <p className="text-[16px] text-gray-600">
                    <strong>Cl:</strong> {item.cl}
                  </p>
                  <p className="text-[16px] text-gray-600">
                    <strong>Imagem:</strong>
                  </p>
                </div>

                <div className="w-full h-[300px] overflow-hidden rounded-md">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={item.imgUrl}
                    alt={`Imagem do item ${item.nomeObjeto}`}
                  />
                </div>

                <div className="flex flex-col gap-3 w-full mt-3 ">
                  <button
                    className="text-[16px] font-semibold bg-red-500 w-full text-white py-2 rounded-md shadow-md hover:bg-red-600 transform hover:scale-105 transition-all hover:cursor-pointer"
                    onClick={() => handleAction("deletar", item.id_retirada)}
                  >
                    Rejeitar Retirada?
                  </button>
                  <button
                    className="text-[16px] font-semibold bg-green-500 w-full text-white py-2 rounded-md shadow-md hover:bg-green-600 transform hover:scale-105 transition-all hover:cursor-pointer"
                    onClick={() => handleAction("aprovar", item.id_retirada)}
                  >
                    Aprovar Retirada?
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
