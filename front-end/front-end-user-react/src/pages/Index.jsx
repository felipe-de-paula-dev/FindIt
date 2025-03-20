import { useRef, useState } from "react";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { Top } from "../components/Top";
import { NavSuperior } from "../components/NavSuperior";
import { Objetos } from "../components/Objetos";
import { PrimaryContent } from "../components/PrimaryContent";

export function Index() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [campus, setCampusFunction] = useState("");
  const filterRef = useRef(null);

  const rolarParaFiltro = () => {
    filterRef.current?.scrollTo();
  };

  const rolarParaOTopo = () => {
    filterRef.current?.scrollTo();
  };

  return (
    <div className="overflow-hidden">
      <NavSuperior />
      <Nav />
      <PrimaryContent onRolagem={rolarParaFiltro} />
      <Filter
        ref={filterRef}
        setSearch={setSearch}
        setLocation={setLocation}
        setCampusFunction={setCampusFunction}
      />
      <Top onRolagemTop={rolarParaOTopo} />
      <div className="w-[95%] flex items-center justify-center m-auto">
        <Objetos search={search} location={location} campus={campus} />
      </div>
      <Footer />
    </div>
  );
}
