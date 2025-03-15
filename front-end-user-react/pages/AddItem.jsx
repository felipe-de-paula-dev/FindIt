import { AddItemComponent } from "../components/AddItemComponent";
import { Filter } from "../components/Filter";
import { Footer } from "../components/Footer";
import { Home } from "../components/Home";
import { Nav } from "../components/Nav";
import { NavSuperior } from "../components/NavSuperior";
import { Objetos } from "../components/Objetos";
import { PrimaryContent } from "../components/PrimaryContent";

export function AddItem() {
  return (
    <>
      <Home />
      <NavSuperior />
      <Nav />
      <AddItemComponent />
      <Footer />
    </>
  );
}
