import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Filter } from "./Filter";

import Swal from "sweetalert2";

function formatarData(data) {
  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data inválida";
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${mes}/${dia}/${ano}`;
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
          `http://localhost:3333/itens/disponiveis/search?query=${search}&location=${locationObject}&campus=${campus}`
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

  async function deletarItem(id) {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const responseItem = await fetch(
          `http://localhost:3333/usuarios/excluir/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseItem.ok) {
          throw new Error("Erro ao excluir o usuário");
        }

        const responseLog = await fetch(
          `http://localhost:3333/logs/excluirIdItem/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseLog.ok) {
          throw new Error("Erro ao excluir o log");
        }

        Swal.fire(
          "Excluído!",
          "O item e o log foram removidos com sucesso.",
          "success"
        );
        setReload(true);
      } catch (error) {
        console.error("Erro ao excluir item:", error);
        Swal.fire("Erro!", `Falha ao excluir: ${error.message}`, "error");
        setReload(true);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-8vh)]  items-center flex-col">
        <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
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
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
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
          <div className="flex flex-wrap justify-center gap-5 w-[95%] h-full mt-5">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 w-[200px] h-fit items-center p-3 bg-slate-50 rounded-md border border-slate-200 shadow-md"
              >
                <div className="w-full">
                  <p className="text-sm text-gray-600">
                    <strong>Nome:</strong> {item.nome_item}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Data:</strong> {formatarData(item.data_encontrado)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Local:</strong> {item.local_encontrado}
                  </p>
                </div>
                {item.imagem_url ? (
                  <img
                    className="w-full h-[200px] object-cover rounded-md shadow-sm"
                    src={item.imagem_url}
                    alt={`Imagem de ${item.nome_item}`}
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Sem imagem disponível</p>
                )}
                <button
                  className="bg-red-500 text-white w-[100%] py-1 rounded hover:cursor-pointer"
                  onClick={() => deletarItem(item.id_item)}
                >
                  Excluir Item?
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
