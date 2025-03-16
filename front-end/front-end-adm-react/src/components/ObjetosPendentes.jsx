import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Filter } from "./Filter";

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

export function ObjetosPendentes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [search, setSearch] = useState("");
  const [locationObject, setLocation] = useState("");
  const [campus, setCampusFunction] = useState("");
  const filterRef = useRef(null);

  async function aprovar_item(id) {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja aprovar este item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, aprovar",
      cancelButtonText: "Não, cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/usuarios/pendentes/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "Disponível" }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao aprovar item: ${response.statusText}`);
        }

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Item Aprovado Com Sucesso!",
        });
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao aprovar o item!",
        });
      }
    }
  }

  async function reprovar_item(id) {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja apagar este item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, apagar",
      cancelButtonText: "Não, cancelar",
    });

    if (result.isConfirmed) {
      try {
        const responseUsuario = await fetch(
          `https://findit-08qb.onrender.com/usuarios/excluir/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseUsuario.ok) {
          throw new Error(
            `Erro ao excluir item: ${responseUsuario.statusText}`
          );
        }

        const responseLog = await fetch(
          `https://findit-08qb.onrender.com/logs/excluir/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseLog.ok) {
          throw new Error(`Erro ao excluir log: ${responseLog.statusText}`);
        }

        Swal.fire({
          icon: "success",
          title: "Sucesso",
          text: "Item Apagado Com Sucesso!",
        });
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Ocorreu um erro ao excluir o item!",
        });
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/itens/pendentes/search?query=${search}&location=${locationObject}&campus=${campus}`
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

  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-8vh)]  items-center flex-col">
        <div className="w-[95%]  border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Visão Geral - Objetos Pendentes
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
            <p className="font-semibold text-gray-800 ">Recarregar</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-max">
          <p className="text-gray-600 text-lg mt-6">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-8vh)]  items-center flex-col">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral - Objetos Pendentes
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
                  <p className="text-sm text-gray-600">
                    <strong>Imagem:</strong>
                  </p>
                  <button
                    onClick={() => {
                      aprovar_item(item.id_item);
                      setReload(true);
                    }}
                    className="w-full bg-green-500 text-white border rounded-md p-0.5 shadow mt-2 hover:cursor-pointer hover:bg-white hover:text-green-500 hover:border-green-500 transition-all"
                  >
                    Aprovar Item?
                  </button>
                  <button
                    onClick={() => {
                      reprovar_item(item.id_item);
                      setReload(true);
                    }}
                    className="w-full bg-red-500 text-white border rounded-md p-0.5 shadow mt-2 hover:cursor-pointer hover:bg-white hover:text-red-500 hover:border-red-500 transition-all"
                  >
                    Reprovar Item?
                  </button>
                </div>
                {item.imagem_url ? (
                  <img
                    className="w-full h-[200px] object-cover rounded-md shadow-sm"
                    src={item.imagem_url}
                    alt={`Imagem do ${item.nome_item}`}
                  />
                ) : (
                  <p className="text-gray-400 text-sm">Sem imagem disponível</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
