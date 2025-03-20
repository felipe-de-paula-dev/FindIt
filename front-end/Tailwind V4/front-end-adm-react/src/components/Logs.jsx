import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import Swal from "sweetalert2";

function formatarData(data) {
  const dataObj = new Date(data);
  if (isNaN(dataObj)) return "Data inválida";

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

export function Logs() {
  const [log, setLog] = useState([]);
  const [reload, setReload] = useState(false);

  function removerLog(id) {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setReload(true);
        fetch(`https://findit-08qb.onrender.com/logs/excluir/${id}`, {
          method: "DELETE",
        })
          .then(() => {
            Swal.fire(
              "Excluído!",
              "O log foi removido com sucesso.",
              "success"
            );
          })
          .catch(() => {
            Swal.fire("Erro!", "Falha ao excluir o log.", "error");
          });
      }
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://findit-08qb.onrender.com/logs", {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setLog(data);
        }
      } catch (err) {
        console.log("Erro ao ler os logs", err);
      }
    }
    fetchData();
  }, [reload, setReload]);

  useEffect(() => {
    setTimeout(() => {
      setReload(false);
    }, 2000);
  }, [reload, setReload]);

  return (
    <div className="w-full flex flex-col items-center overflow-y-auto h-[calc(100vh-8vh)]  px-6 py-8">
      <div className="w-[95%]  border-b pb-4 border-gray-300 flex justify-between items-center  px-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Logs dos objetos
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

      {log.length === 0 ? (
        <p className="text-center text-gray-500 text-lg  mt-6">
          Nenhum Objeto Encontrado.
        </p>
      ) : (
        <table className="w-[80%] border-collapse mt-2 font-sans">
          <thead>
            <tr className="bg-[#355315] text-white uppercase">
              <th className="border border-gray-300 px-2 py-1 text-center">
                ID Log
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Nome Item
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Data Adicionado
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Data Movimentação
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Achado Em
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Campus
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Situação
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Retirado Por
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Aluno CL
              </th>
              <th className="border border-gray-300 px-2 py-1 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {log.map((item, index) => (
              <tr key={index} className="hover:bg-gray-300">
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {item.id_log}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {item.nome_item}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {formatarData(item.data_adicionado)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {formatarData(item.data_movimentacao)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {item.localizacao || "N/D"}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {item.campus === 1
                    ? "Cotil FT"
                    : item.campus === 2
                    ? "FCA"
                    : "N/D"}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {item.situacao}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {item.retirado_por}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {item.clAluno}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => removerLog(item.id_log)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
