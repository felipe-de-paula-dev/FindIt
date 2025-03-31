/* eslint-disable react/prop-types */
import { BellRing, MessageCircleMore, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function NavUser(props) {
  const [campus, setCampus] = useState();
  useEffect(() => {
    async function fetchData() {
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
      setCampus(dataToken.cargoId.cargoId);
    }
    fetchData();
  }, []);
  return (
    <div className="bg-slate-100 w-full h-min p-2 flex justify-between overflow-hidden border-b-1 border-slate-200">
      <ul>
        <select
          name="status"
          id="status"
          className="p-1 shadow border border-slate-100 rounded-b-md w-min"
        >
          <option value="Online">🟢 Online</option>
          <option value="Offline">⭕ Offline</option>
          <option value="Ausente">🟡 Ausente</option>
          <option value="Não/Pertube">🔴 Não Pertube</option>
        </select>
      </ul>
      <ul className="flex items-center gap-4">
        <div
          className={`${
            campus == 1
              ? "bg-blue-300 text-blue-700"
              : campus == 2
              ? "bg-orange-300 text-orange-700"
              : campus == 3
              ? "bg-green-300 text-green-700"
              : " bg-red-300 text-red-700"
          } font-semibold rounded-xl px-1 p-[2px]`}
        >
          {campus == 1
            ? "Administrador"
            : campus == 2
            ? "Demo"
            : campus == 3
            ? "Funcionario"
            : "Não Conectado"}
        </div>
        <div className="p-1 shadow border border-slate-100 rounded-b-md flex">
          <input
            type="text"
            name=""
            id=""
            className="mr-2 border-r-1 border-slate-300"
          />
          <Search size={24} />
        </div>
        <BellRing
          className="p-1 shadow border border-slate-100 rounded-b-md"
          size={32}
        />
        <div className="p-1 shadow border border-slate-100 rounded-b-md w-min flex gap-1">
          <MessageCircleMore />
          <select name="status" id="status">
            <option value="Mensagens" selected>
              Mensagens
            </option>
          </select>
        </div>
        <div className="flex w-[36px] h-[36px] items-center justify-center  overflow-hidden object-cover rounded-full">
          <img
            src={props.imagemUser}
            alt="Imagem do usuário"
            className="rounded-full"
          />
        </div>
      </ul>
    </div>
  );
}
