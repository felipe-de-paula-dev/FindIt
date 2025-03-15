/* eslint-disable react/prop-types */
import {
  ChartColumn,
  ListCheck,
  ClockAlert,
  CalendarClock,
  UserRoundPlus,
  User,
  Layers,
} from "lucide-react";
import { ReportOption } from "./ReportOption";
import { useEffect, useState } from "react";

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
        icon: <ClockAlert size={20} />,
        title: "Objetos Pendentes",
        descricao: "pendentes",
        id: 2,
      },
      {
        icon: <ListCheck size={20} />,
        title: "Objetos aprovados",
        descricao: "aprovados",
        id: 3,
      },
      {
        icon: <CalendarClock size={20} />,
        title: "Retirada de objetos",
        descricao: "retirada",
        id: 4,
      },
    ];
  } else if (selectedOption === "usuarios") {
    title = "Usuarios";
    options = [
      {
        icon: <User size={20} />,
        title: "Todos os usuários",
        descricao: "usuarios",
        id: 5,
      },
      {
        icon: <UserRoundPlus size={20} />,
        title: "Adiconar um Novo Usuario",
        descricao: "usuariosadicionar",
        id: 6,
      },
    ];
  } else if (selectedOption === "logs") {
    title = "Logs";
    options = [
      {
        icon: <Layers size={20} />,
        title: "Logs gerais",
        descricao: "logs",
        id: 7,
      },
    ];
  } else {
    options = [
      { icon: <ChartColumn size={20} />, title: "Relatorio Geral", id: 1 },
    ];
    title = "Relatorios";
  }

  return (
    <div className="flex-col flex justify-between h-full w-min border-r-1 border-slate-200 bg-slate-50">
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
        </ul>
      </div>
    </div>
  );
}
