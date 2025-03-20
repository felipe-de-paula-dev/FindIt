/* eslint-disable react/prop-types */
import {
  CircleHelp,
  Home,
  NotepadText,
  Package,
  Search,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Nav({ onOptionClick, onNavOptionComponent, idClick }) {
  const [selected, setSelectedOption] = useState("");
  const navigate = useNavigate();

  async function goToLogin() {
    const result = await Swal.fire({
      title: "Você Deseja Sair?",
      text: "Essa ação é irreversivel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, Sair",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      navigate("/");
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
  useEffect(() => {
    onNavOptionComponent(selected);
  }, [selected, onNavOptionComponent]);

  return (
    <div className="flex bg-slate-800 w-min h-screen justify-between items-center flex-col p-2">
      <ul>
        <ul
          className="flex items-center mb-[3rem] mt-4 hover:cursor-pointer"
          onClick={() => {
            onOptionClick("home"), setSelectedOption(""), idClick(1);
          }}
        >
          <li>
            <h1 className="text-white text-2xl font-Mulish font-semibold">
              Find
            </h1>
          </li>
          <li>
            <h1 className="text-red-500 text-2xl font-Mulish font-semibold">
              It
            </h1>
          </li>
          <Search className="text-red-500 ml-1" strokeWidth={3} size={20} />
        </ul>
        <ul className="flex space-y-10 items-center flex-col">
          <li
            className="text-[16px] font-[400] text-white flex items-center space-y-2 flex-col transform transition-all hover:scale-105 cursor-pointer hover:text-blue-400"
            onClick={() => {
              onOptionClick("home"), setSelectedOption(""), idClick(1);
            }}
          >
            <Home size={36} />
            Inicio
          </li>
          <li
            className="text-[16px] font-[400] text-white flex  items-center space-y-2 flex-col transform transition-all hover:scale-105 cursor-pointer hover:text-green-400 "
            onClick={() => {
              onOptionClick("objetos"),
                setSelectedOption("aprovados"),
                idClick(2);
            }}
          >
            <Package size={36} />
            Objetos
          </li>
          <li
            className="text-[16px] font-[400] text-white flex  items-center space-y-2 flex-col transform transition-all hover:scale-105 cursor-pointer hover:text-purple-400"
            onClick={() => {
              onOptionClick("usuarios"),
                setSelectedOption("usuarios"),
                idClick(5);
            }}
          >
            <User size={36} />
            Usuarios
          </li>
          <li
            className="text-[16px] font-[400] text-white flex  items-center space-y-2 flex-col transform transition-all hover:scale-105 cursor-pointer hover:text-yellow-400"
            onClick={() => {
              onOptionClick("logs"), setSelectedOption("logs"), idClick(7);
            }}
          >
            <NotepadText size={36} />
            Logs
          </li>
        </ul>
      </ul>
      <ul>
        <li className="text-[18px] text-white flex  items-center space-y-2 flex-col transform transition-all hover:scale-105 cursor-pointer hover:text-red-600">
          <CircleHelp size={32} />
          Ajuda
        </li>
        <button
          className="mt-4 p-1.5 bg-red-700 w-[70px] rounded-[8px] text-white hover:scale-110   cursor-pointer transform transition-all font-semibold"
          onClick={goToLogin}
        >
          Sair
        </button>
      </ul>
    </div>
  );
}
