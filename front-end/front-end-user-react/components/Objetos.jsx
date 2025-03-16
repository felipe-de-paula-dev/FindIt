import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatarData(data) {
  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data inválida";
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${mes}/${dia}/${ano}`;
}

// ---------------------------

export function Objetos({ search, location, campus }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://findit/itens/disponiveis/search?query=${search}&location=${location}&campus=${campus}`
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
    <div className="flex  flex-wrap items-center gap-5 w-[90%] h-full justify-center mt-6 ">
      {data.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum Objeto Encontrado</p>
      ) : (
        data.map((item, index) => (
          <div
            className="w-[100%] h-fit text-xl flex flex-col gap-2 bg-slate-50 rounded-md border-2 border-slate-200 p-3 md:w-[300px] shadow"
            key={index}
          >
            <p>
              Nome: <b>{item.nome_item}</b>
            </p>
            <p>
              Data: <b>{formatarData(item.data_encontrado)}</b>
            </p>
            <p>
              Local: <b>{item.local_encontrado}</b>
            </p>
            <button
              className="bg-green-700 text-white p-1 rounded-sm border border-transparent hover:cursor-pointer hover:bg-white hover:border-green-600 hover:text-green-600 transition-all"
              onClick={() => {
                handleClick(item);
              }}
            >
              Agendar Retirada
            </button>
            <img
              src={item.imagem_url}
              alt=""
              className="rounded-sm h-[300px] object-cover"
            />
          </div>
        ))
      )}
    </div>
  );
}
