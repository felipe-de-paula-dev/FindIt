/* eslint-disable react/prop-types */
import { BellRing, MessageCircleMore, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function NavUser(props) {
  const [campus, setCampus] = useState();
  useEffect(() => {
    async function fetchData() {
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
      setCampus(dataToken.cargoId.cargoId);
    }
    fetchData();
  }, []);
  return (
    <div className="bg-slate-100 w-full p-3 flex justify-between items-center border-b border-slate-200 shadow-sm">
      <select
        name="status"
        id="status"
        className="px-3 py-1 shadow-sm border border-slate-300 rounded-md text-sm focus:outline-none"
      >
        <option value="Online">🟢 Online</option>
        <option value="Offline">⭕ Offline</option>
        <option value="Ausente">🟡 Ausente</option>
        <option value="Não/Pertube">🔴 Não Perturbe</option>
      </select>

      <div className="flex items-center gap-4">
        <div
          className={`text-sm font-semibold px-2 py-1 rounded-xl ${
            campus == 1
              ? "bg-blue-200 text-blue-800"
              : campus == 2
              ? "bg-orange-200 text-orange-800"
              : campus == 3
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {campus == 1
            ? "Administrador"
            : campus == 2
            ? "Demo"
            : campus == 3
            ? "Funcionário"
            : "Não Conectado"}
        </div>

        <div className="flex items-center px-2 py-1 border border-slate-300 rounded-md bg-white shadow-sm">
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none pr-2 text-sm"
          />
          <Search size={20} className="text-slate-500" />
        </div>

        <button className="p-1 border border-slate-300 rounded-md bg-white shadow-sm hover:bg-slate-200 transition">
          <BellRing size={24} className="text-slate-600" />
        </button>

        <div className="flex items-center px-2 py-1 border border-slate-300 rounded-md bg-white shadow-sm gap-1">
          <MessageCircleMore size={20} className="text-slate-600" />
          <select
            name="mensagens"
            id="mensagens"
            className="text-sm bg-transparent outline-none"
          >
            <option value="Mensagens" defaultValue={"Mensagens"}>
              Mensagens
            </option>
          </select>
        </div>

        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 shadow-sm">
          <img
            src={props.imagemUser}
            alt="Imagem do usuário"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
