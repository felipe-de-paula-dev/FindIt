import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function User() {
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://findit-08qb.onrender.com/users", {
          method: "GET",
        });
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.log("Erro ao listar Usuarios", err);
      }
    }
    fetchData();
  }, [reload]);

  useEffect(() => {
    setTimeout(() => {
      setReload(false);
    }, 1000);
  }, [reload]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  async function deleteUser(id) {
    const result = await Swal.fire({
      title: "Você quer deletar o Usuario?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      const response = await fetch(
        `https://findit-08qb.onrender.com/user/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Deletado!",
          text: "O Usuario Foi Deletado Com Sucesso!",
          timer: 3000,
        });
        const updatedData = data.filter((user) => user.id !== id);
        setData(updatedData);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Erro desconhecido",
          timer: 2000,
        });
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8vh)] overflow-y-auto items-center w-full px-6 py-8">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center px-6 ">
        <h2 className="text-2xl font-semibold text-gray-800">
          Todos os Usuários
        </h2>
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

      {alert && (
        <div
          className={`absolute top-0 left-[50%] translate-x-[-50%] mt-4 p-3 rounded-md text-white ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      {data.length === 0 ? (
        <p className="text-gray-500 text-lg mt-6">Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white p-5 rounded-2xl border border-gray-300 shadow-md transition-transform hover:scale-105"
            >
              <img
                src={item.urlImagem}
                alt="Usuário"
                className="w-24 h-24 rounded-full overflow-hidden object-cover border-4 border-gray-400 transition-all hover:brightness-110"
              />
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  {item.user}
                </p>
                <p className="text-gray-600">
                  <b>Senha:</b> ******
                </p>
                <p className="text-gray-600">
                  <b>Cargo:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      item.cargoId === 1
                        ? "bg-blue-200 text-blue-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {item.cargoId === 1 ? "Administrador" : "Funcionário"}
                  </span>
                </p>
                <button
                  className="mt-4 text-[15px] bg-red-200 border border-transparent text-red-500 font-semibold px-2 py-1 rounded-[15px] hover:cursor-pointer hover:bg-white hover:border hover:border-red-500"
                  onClick={() => {
                    deleteUser(item.id);
                  }}
                >
                  Excluir Usuario?
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
