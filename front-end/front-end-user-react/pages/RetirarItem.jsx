import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { FormularioRetirada } from "../components/FormularioRetirada";
import { Home } from "../components/Home";
import { Map } from "../components/Map";
import { Nav } from "../components/Nav";
import { NavSuperior } from "../components/NavSuperior";
import { Objetos } from "../components/Objetos";
import { PrimaryContent } from "../components/PrimaryContent";

export function RetirarItem() {
  return (
    <div className="overflow-hidden ">
      <Home />
      <NavSuperior />
      <Nav />
      <Map />
      <FormularioRetirada />
      <Footer />
    </div>
  );
}
