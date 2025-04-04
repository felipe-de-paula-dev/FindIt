import { CalendarClock, Link, Map, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DescricaoItem } from "./DescricaoItem";

function formatarData(data) {
  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data inválida";
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// ---------------------------

export function ObjetosV2({ search, location, campus }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/itens/disponiveis/search?query=${search}&location=${location}&campus=${campus}`
        );
        const result = await response.json();
        setData(result);
        console.log({ search, location, campus });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [search, location, campus]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div class="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleClick = (item) => {
    Navigate(`/Map?id=${item.id_item}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-5 w-[90%] h-full justify-center mt-6 ">
      {data.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum Objeto Encontrado</p>
      ) : (
        data.map((item, index) => (
          <div
            className={`w-full md:w-[330px] bg-white rounded-lg border border-gray-200 shadow-lg p-4 flex flex-col gap-3 ${
              item.campus === 1
                ? "border-blue-800 border"
                : "border-red-400 border"
            }`}
            key={index}
          >
            <p className="text-xl font-semibold text-gray-700">
              <span className="text-gray-900">{item.nome_item}</span>
            </p>

            <p className="text-gray-600 text-[17px] flex items-center gap-1">
              <CalendarClock />
              Data:{" "}
              <span className="font-medium text-gray-800">
                {formatarData(item.data_encontrado)}
              </span>
            </p>

            <p className="text-gray-600 text-[17px]  flex items-center gap-1">
              <Map />
              Local:{" "}
              <span className="font-medium text-gray-800 text-nowrap">
                {item.local_encontrado ? (
                  <DescricaoItem nome={item.local_encontrado} />
                ) : (
                  "Carregando..."
                )}
              </span>
            </p>

            <p className="text-gray-600 text-[17px] flex items-center gap-2">
              <MapPin />
              Campus:{" "}
              <span className="font-medium text-gray-800">
                {item.campus == 1 ? (
                  <div className="bg-blue-200 text-blue-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                    COTIL / FT
                  </div>
                ) : (
                  <div className="bg-red-200 text-red-700 px-2 rounded-[10px] w-min h-min text-nowrap">
                    FCA
                  </div>
                )}
              </span>
            </p>

            {/*
              <div className="w-full h-[320px] overflow-hidden rounded-lg">
                <img
                  src={item.imagem_url}
                  alt={item.nome_item}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              */}

            <button
              className="bg-green-600 text-white font-medium py-2 rounded-lg mt-2 transition-all border border-transparent 
               hover:bg-white hover:text-green-600 hover:border-green-600 shadow-md hover:cursor-pointer"
              onClick={() => handleClick(item)}
            >
              Agendar Retirada
            </button>
          </div>
        ))
      )}
    </div>
  );
}
