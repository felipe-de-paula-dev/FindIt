import { FilterIcon, Search } from "lucide-react";
import { useEffect } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

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

const Filter = forwardRef(
  ({ setSearch, setLocation, setCampusFunction }, ref) => {
    const localRef = useRef(null);
    const [search, setSearchInput] = useState("");
    const [location, setLocationSelect] = useState("");
    const [campus, setCampus] = useState(0);

    useImperativeHandle(ref, () => ({
      scrollTo: () => {
        if (localRef.current) {
          localRef.current.scrollIntoView({ behavior: "smooth" });
        }
      },
    }));

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
        className="flex flex-col items-center justify-between w-full gap-2 mt-10"
        ref={localRef}
        id="filtro"
      >
        <div className="flex gap-2 flex-col w-full items-center">
          <div className="flex items-center gap-2">
            <Search className="text-red-500" />
            <p className="text-2xl font-semibold">Pesquise</p>
          </div>
          <div className="w-[80%] flex items-center">
            <input
              type="search"
              className="bg-gray-100 p-2 w-full rounded-sm focus:ring-1 focus:ring-red-500 border-none focus:outline-none transition-all"
              placeholder="Digite Aqui"
              value={search}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Search
              className="bg-red-600 w-auto h-full p-1 rounded-tr-sm rounded-br-sm text-white hover:cursor-pointer transform translate-x-[-3px]"
              size={37}
              onClick={() => setSearch(search)}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-col items-center w-full mt-3">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-red-500" />
            <p className="text-2xl font-semibold">Filtros</p>
          </div>
          <div className="flex gap-4 w-[80%]">
            <select
              name="campus"
              className="bg-gray-100 p-2 rounded-lg w-full border border-gray-300 focus:ring-1 transition-all focus:ring-red-500 focus:outline-none"
              defaultValue=""
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value), setCampusFunction(e.target.value);
              }}
            >
              <option value="">Selecione o Campus</option>
              <option value="1">Campus 1 - Cotil</option>
              <option value="2">Campus 2 - FCA</option>
            </select>
            <select
              name="localizacao"
              className="bg-gray-100 p-2 rounded-lg w-full border border-gray-300 focus:ring-1 transition-all focus:ring-red-500 focus:outline-none"
              defaultValue=""
              value={location}
              onChange={(e) => {
                const selectedLocation = e.target.value;
                setLocationSelect(selectedLocation),
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
        <h1 className="mt-5 text-3xl font-semibold text-gray-800">
          Veja Os Itens <span className="text-red-500">Abaixo</span>
        </h1>
        <div className="border-b-1 w-[95%] border-gray-300 mt-4 blur-[1px]"></div>
      </div>
    );
  }
);

export { Filter };
