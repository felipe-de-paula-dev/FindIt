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
          `http://localhost:3333/retirada/search?query=${search}&location=${locationObject}&campus=${campus}`
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
      <div className="flex w-full h-[calc(100vh-8vh)]   items-center flex-col">
        <div className="w-full max-w-4xl border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
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

  function truncarTexto(texto, limite) {
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
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
          await fetch(`http://localhost:3333/retirada/excluir/${id}`, {
            method: "DELETE",
          });
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
            `http://localhost:3333/retirada/aprovar/${id}`,
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

      <div className="flex w-full h-fit justify-center overflow-y-auto p-3 mb-5 pb-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 mt-6 text-lg">
            Nenhum Objeto Encontrado.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 w-[95%] h-full mt-10">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 w-[200px] h-fit items-center p-3 bg-slate-50 rounded-md border border-slate-200 shadow-md"
              >
                <div className="w-full">
                  <p className="text-sm text-gray-600">
                    <strong>Nome Objeto: </strong>
                  </p>
                  <p className="text-sm text-gray-800 font-[600]">
                    {truncarTexto(item.nomeObjeto, 13)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Nome:</strong> {item.nome}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Cl:</strong> {item.cl}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Imagem:</strong>
                  </p>
                </div>
                <img
                  className="w-full h-[200px] object-cover rounded-md shadow-sm"
                  src={item.imgUrl}
                  alt="Imagem do item"
                />
                <div className="flex flex-col gap-2 w-full">
                  <button
                    className="text-[16px] font-semibold bg-red-400 w-full text-white p-2 rounded-md shadow hover:cursor-pointer transform hover:scale-105 transition-all hover:text-white hover:bg-red-600"
                    onClick={() => handleAction("deletar", item.id_retirada)}
                  >
                    Rejeitar Retirada?
                  </button>
                  <button
                    className="text-[16px] font-semibold text-white bg-green-400 p-2 rounded-md shadow hover:cursor-pointer transform hover:scale-105 transition-all hover:text-white hover:bg-green-600"
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
