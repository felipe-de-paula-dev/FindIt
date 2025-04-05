/* eslint-disable react/prop-types */
import { FilterIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Filter = ({ setSearch, setLocation, setCampusFunction }) => {
  const localRef = useRef(null);
  const [search, setSearchInput] = useState("");
  const [location, setLocationSelect] = useState("");
  const [campus, setCampus] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (campus == 0) return;
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/api/campus/${campus}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        setData(data);
      } catch (err) {
        console.log("Ocorreu um erro:", err);
      }
    }
    fetchData();
  }, [campus]);

  useEffect(() => {
    if (campus === "") {
      setLocation("");
      setLocationSelect("");
    } else {
      setLocation("");
      setLocationSelect("");
    }
  }, [campus, setLocation]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSearch(event.target.value);
    }
  };

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
            className="bg-gray-50 p-2 py-[8.5px] w-full border border-gray-300 rounded-lg focus:bg-red-50 focus:ring-1 focus:ring-red-500  focus:outline-none transition-all"
            placeholder="Digite Aqui"
            value={search}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Search
            className="bg-red-600 w-auto h-full p-1 border ring-1 ring-red-500 border-red-600 rounded-tr-sm rounded-br-sm text-white hover:cursor-pointer transform translate-x-[-3px]"
            size={33}
            onClick={() => setSearch(search)}
          />
        </div>
      </div>
      <div className="flex gap-2 flex-col items-center w-full mt-3">
        <div className="flex items-center gap-2">
          <FilterIcon className="text-red-500" />
          <p className="text-2xl font-semibold">Filtros</p>
        </div>
        <div className="flex flex-col sm:flex-row  gap-4 w-[80%]">
          <select
            name="campus"
            className="bg-gray-50 p-2 rounded-lg w-full border border-gray-300 focus:ring-1 transition-all focus:ring-red-500 focus:outline-none"
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
            className="bg-gray-50 p-2 rounded-lg w-full border border-gray-300 focus:ring-1 transition-all focus:ring-red-500 focus:outline-none"
            defaultValue=""
            value={location}
            onChange={(e) => {
              const selectedLocation = e.target.value;
              setLocationSelect(selectedLocation),
                setLocation(selectedLocation);
            }}
          >
            {campus === "1" || campus === "2" ? (
              data.map((option, index) => (
                <option
                  key={index}
                  value={option.nome}
                  disabled={option.disabled}
                >
                  {option.descricao}
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
      <div className="border-b w-[95%] border-gray-300 mt-4 blur-[1px]"></div>
    </div>
  );
};

export { Filter };
