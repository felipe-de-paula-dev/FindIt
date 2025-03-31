/* eslint-disable react/prop-types */
import {
  ChartColumn,
  CalendarClock,
  UserRoundPlus,
  User,
  Layers,
  CopyPlus,
  PackageCheck,
  Map,
} from "lucide-react";
import { ReportOption } from "./ReportOption";
import { useEffect, useState } from "react";
import { MapaInterativoSwal } from "./MapaInterativoSwal";
// import { AddItemSwal } from "./AddItemSwal";

export function Report({ selectedOption, onOptionComponent, idClick }) {
  const [clicou, setarclick] = useState(0);

  const handleClick = (option) => {
    onOptionComponent(option);
  };

  useEffect(() => {
    setarclick(idClick);
  }, [idClick]);

  useEffect(() => {
    setarclick(1);
  }, []);

  const click = (id) => {
    setarclick(id);
  };

  let title;
  let options;

  if (selectedOption === "objetos") {
    title = "Objetos";
    options = [
      {
        icon: <PackageCheck size={20} />,
        title: "Todos Os Objetos",
        descricao: "aprovados",
        id: 2,
      },
      {
        icon: <CopyPlus size={20} />,
        title: "Adicionar Objeto",
        descricao: "adicionar",
        id: 3,
      },
      {
        icon: <CalendarClock size={20} />,
        title: "Retirada de objetos",
        descricao: "retirada",
        id: 4,
      },
    ];
  } else if (selectedOption === "mapas") {
    title = "Mapa Do Campus";
    options = [
      {
        icon: <Map size={20} />,
        title: "Listar Locais",
        descricao: "mapas",
        id: 10,
      },
    ];
  } else if (selectedOption === "usuarios") {
    title = "Usuarios";
    options = [
      {
        icon: <User size={20} />,
        title: "Todos os usuários",
        descricao: "usuarios",
        id: 6,
      },
      {
        icon: <UserRoundPlus size={20} />,
        title: "Adiconar um Novo Usuario",
        descricao: "usuariosadicionar",
        id: 7,
      },
    ];
  } else if (selectedOption === "logs") {
    title = "Logs";
    options = [
      {
        icon: <Layers size={20} />,
        title: "Logs gerais",
        descricao: "logs",
        id: 8,
      },
    ];
  } else {
    options = [
      { icon: <ChartColumn size={20} />, title: "Relatorio Geral", id: 1 },
    ];
    title = "Relatorios";
  }

  return (
    <div className="flex-col flex justify-between h-full w-min border-r-1 border-slate-200 bg-slate-100">
      <div>
        <h1 className="text-xl font-medium pl-4 mt-3">{title}</h1>
        <ul className="flex flex-col mt-3 w-[250px]">
          {options.map((option) => (
            <ReportOption
              key={option.id}
              id={option.id}
              onClick={() => {
                handleClick(option.descricao);
                click(option.id);
              }}
              isClicked={clicou === option.id}
            >
              {option.icon}
              {option.title}
            </ReportOption>
          ))}
          {selectedOption == "mapas" ? <MapaInterativoSwal /> : ""}
        </ul>
      </div>
    </div>
  );
}

//  {selectedOption == "objetos" ? <AddItemSwal /> : ""}
