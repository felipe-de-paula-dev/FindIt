import {
  Check,
  IdCard,
  LucideFileQuestion,
  MapPin,
  RefreshCcw,
  User,
  X,
} from "lucide-react";
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
    if (dataToken.cargoId.cargoId == 1) {
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
            confirmButtonColor: "#00BFFF",
            cancelButtonColor: "#696969",
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
              confirmButtonColor: "#696969",
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
            confirmButtonColor: "#00BFFF",
            cancelButtonColor: "#696969",
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
                confirmButtonColor: "#696969",
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Aprovado!",
                text: "A retirada foi aprovada com sucesso.",
                confirmButtonColor: "#696969",
              });
              setReload(true);
            }
          }
        }
      } catch (error) {
        console.error(`Erro ao ${action} retirada:`, error);
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
                <div className="w-full space-y-1">
                  <p className="text-xl font-semibold text-gray-800">
                    <span className="text-gray-900">{item.nomeObjeto}</span>
                  </p>
                  <p className="text-[17px] text-gray-800 flex items-center gap-2">
                    <User />
                    <span className="font-semibold">Nome:</span> {item.nome}
                  </p>
                  <p className="text-[17px] text-gray-800 flex items-center gap-2">
                    <IdCard />
                    <span className="font-semibold">Cl:</span> {item.cl}
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
                  <p className="text-gray-600 text-[17px] flex items-center gap-2">
                    <LucideFileQuestion />
                    Situação:{" "}
                    <span className="font-medium text-gray-800 ">
                      {item.situacao == "pendente" ? (
                        <div className="bg-red-200 text-red-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                          Pendente
                        </div>
                      ) : (
                        <div className="bg-green-200 text-green-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                          Disponivel
                        </div>
                      )}
                    </span>
                  </p>
                </div>

                <div className="w-full h-[300px] overflow-hidden rounded-md">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={item.imgUrl}
                    alt={`Imagem do item ${item.nomeObjeto}`}
                  />
                </div>

                <div className="flex justify-center gap-3 w-full mt-3 ">
                  <button
                    className="text-[16px] font-semibold bg-red-500 w-min p-3 text-white py-2 rounded-md shadow-md hover:bg-red-600 transform hover:scale-105 transition-all hover:cursor-pointer"
                    onClick={() => handleAction("deletar", item.id_retirada)}
                  >
                    <X />
                  </button>
                  <button
                    className={`text-[16px] font-semibold bg-green-500 w-min p-3 text-white py-2 rounded-md shadow-md hover:bg-green-600 transform hover:scale-105 transition-all hover:cursor-pointer`}
                    onClick={() => handleAction("aprovar", item.id_retirada)}
                  >
                    <Check />
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
