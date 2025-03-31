import { useState } from "react";
import { Footer } from "../components/Footer";
import { FormularioRetirada } from "../components/FormularioRetirada";
import { Home } from "../components/Home";
import { Map } from "../components/Map";
import { Nav } from "../components/Nav";
import { NavSuperior } from "../components/NavSuperior";

export function RetirarItem() {
  const [campus, setCampus] = useState(0);
  return (
    <div className="overflow-hidden ">
      <Home />
      <NavSuperior />
      <Nav campus={setCampus} />
      <Map />
      <FormularioRetirada setCampus={campus} />
      <Footer />
    </div>
  );
}
