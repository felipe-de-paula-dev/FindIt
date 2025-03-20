/* eslint-disable react/prop-types */
import { BellRing, MessageCircleMore, Search } from "lucide-react";

export function NavUser(props) {
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
