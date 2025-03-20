/* eslint-disable react/prop-types */
import { FilterIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Campus1 = [
  { value: "", label: "Escolha uma Opção" },
  { value: "Sala", label: "Sala de Aula" },
  { value: "Biblioteca", label: "Biblioteca" },
  { value: "Portaria1", label: "Portaria Principal" },
  { value: "Portaria2", label: "Portaria Secundária" },
  { value: "RUCotil", label: "Restaurante Universitário" },
  { value: "Patio", label: "Pátio" },
  { value: "Faculdade", label: "FT - Faculdade" },
  { value: "Outro", label: "Outros" },
];

const Campus2 = [
  { value: "", label: "Escolha uma Opção" },
  { value: "Sala", label: "Sala de Aula" },
  { value: "LabMateriais", label: "Laboratório de Materiais" },
  { value: "LabDisturbios", label: "Laboratório de Distúrbios" },
  { value: "Biblioteca", label: "Biblioteca" },
  { value: "Congregacao", label: "Sala de Congregação" },
  { value: "Portaria1", label: "Portaria Principal" },
  { value: "Portaria2", label: "Portaria Secundária" },
  { value: "PortariaCarros", label: "Portaria Carros" },
  { value: "RURestaurante", label: "Restaurante Universitário" },
  { value: "Patio", label: "Pátio" },
  { value: "Outro", label: "Outros" },
];

const Filter = ({ setSearch, setLocation, setCampusFunction }) => {
  const localRef = useRef(null);
  const [search, setSearchInput] = useState("");
  const [location, setLocationSelect] = useState("");
  const [campus, setCampus] = useState(0);

  useEffect(() => {
    if (campus === "") {
      setLocation("");
      setLocationSelect("");
    } else {
      setLocation("");
      setLocationSelect("");
    }
  }, [campus, setLocation]);

  return (
    <div
      className="flex items-center w-[95%] mt-4 border-b border-slate-200 pb-6"
      ref={localRef}
      id="filtro"
    >
      <div className="flex gap-2 flex-col w-full items-center">
        <div className="flex  items-center gap-2">
          <Search />
          <p className="text-2xl font-semibold">Pesquise</p>
        </div>
        <div className="w-[80%] flex items-center">
          <input
            type="search"
            className="bg-slate-100 p-1 shadow rounded-sm rounded-br-none rounded-tr-none w-full focus:ring-red-600 focus:border-b-1 focus:bg-red-100 border-red-600 focus:outline-none transition-all pl-2"
            placeholder="Digite Aqui"
            value={search}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search
            className="bg-red-600 w-[35px] h-[33px] p-1 rounded-tr-sm rounded-br-sm text-white hover:cursor-pointer"
            size={64}
            onClick={() => setSearch(search)}
          />
        </div>
      </div>
      <div className="border border-slate-200 h-full"></div>
      <div className="flex gap-2 flex-col w-full items-center">
        <div className="flex items-center gap-2">
          <FilterIcon />
          <p className="text-2xl font-semibold">Filtros</p>
        </div>
        <div className="w-[80%] gap-2 flex items-center">
          <select
            name="campus"
            className="bg-slate-100 rounded-sm shadow p-1 w-full"
            defaultValue=""
            value={campus}
            onChange={(e) => {
              setCampus(e.target.value), setCampusFunction(e.target.value);
            }}
          >
            <option value="">Selecione o Campus</option>
            <option value="1">Campus 1 - Cotil / FT</option>
            <option value="2">Campus 2 - FCA</option>
          </select>
          <select
            name="localizacao"
            className="bg-slate-100 rounded-sm shadow p-1 w-full"
            defaultValue=""
            value={location}
            onChange={(e) => {
              const selectedLocation = e.target.value;
              setLocationSelect(selectedLocation);
              setLocation(selectedLocation);
            }}
          >
            {campus === "1" ? (
              Campus1.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            ) : campus === "2" ? (
              Campus2.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            ) : (
              <option value="" disabled selected>
                Selecione um campus válido
              </option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export { Filter };
