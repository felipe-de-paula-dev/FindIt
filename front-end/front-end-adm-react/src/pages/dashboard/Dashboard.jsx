import { useLocation } from "react-router-dom";
import { Nav } from "../../components/Nav";
import { NavUser } from "../../components/NavUser";
import { Report } from "../../components/Report";
import { VisaoGeral } from "../../components/VisaoGeral";
import { AddItem } from "../../components/AddItem";
import { ObjetosAprovados } from "../../components/ObjetosAprovados";
import { RetiradaDeObjetos } from "../../components/RetiradaDeObjetos";
import { useEffect, useState } from "react";
import { Logs } from "../../components/Logs";
import { User } from "../../components/User";
import { UserAdd } from "../../components/UserAdd";

export function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("");
  const [onOptionComponent, setonOptionComponent] = useState("");
  const [idClick, setidClick] = useState(0);

  useEffect(() => {
    const handleUnload = () => {
      const [navEntry] = performance.getEntriesByType("navigation");

      if (navEntry && navEntry.type === "reload") {
        return;
      }

      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        document.cookie =
          "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const location = useLocation();
  const data = location.state || {};
  const img = data.urlImagem;

  let renderedComponent;

  switch (onOptionComponent) {
    case "aprovados":
      renderedComponent = <ObjetosAprovados />;
      break;
    case "adicionar":
      renderedComponent = <AddItem />;
      break;
    case "retirada":
      renderedComponent = <RetiradaDeObjetos />;
      break;
    case "usuarios":
      renderedComponent = <User />;
      break;
    case "usuariosadicionar":
      renderedComponent = <UserAdd />;
      break;
    case "logs":
      renderedComponent = <Logs />;
      break;
    case "geral":
    default:
      renderedComponent = <VisaoGeral />;
      break;
  }

  return (
    <div className=" bg-white flex h-screen w-screen">
      <Nav
        onOptionClick={handleOptionClick}
        onNavOptionComponent={setonOptionComponent}
        idClick={setidClick}
      />
      <div className="flex flex-col w-full">
        <NavUser imagemUser={img} />
        <div className="flex w-full h-full">
          <Report
            idClick={idClick}
            selectedOption={selectedOption}
            onOptionComponent={setonOptionComponent}
          />
          {renderedComponent}
        </div>
      </div>
    </div>
  );
}
