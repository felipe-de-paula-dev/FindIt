import { MapIcon } from "lucide-react";
import { GraficoPizza } from "./GraficoPizza";
import { Grafico } from "./Grafico";
import { GraficoObjetos } from "./GraficoObjetos";
import { useEffect } from "react";
import { useState } from "react";

export function VisaoGeral() {
  const [totalObjetos, setTotalObjetos] = useState(0);
  const [dadosRetirados, setDadosRetirados] = useState([]);
  const [dadosDosObjetos, setDadosDosObjetos] = useState([]);
  const [campus, setCampus] = useState("");
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function fetchDataRetirada() {
      const campusQuery = campus === "" ? 0 : campus;
      const result = await fetch(
        `https://findit-08qb.onrender.com/itens/contagem-itens?campus=${campusQuery}`,
        {
          method: "GET",
        }
      );
      const data = await result.json();
      const totalItens = data.totalItens;
      const dados = data.itensPorLocal;
      const dadosDosObjetos = data.itensPorNome;

      const dadosRetirados = [
        { local: `Retirados`, quantidade: data.retirados },
        {
          local: "Não Retirados",
          quantidade: data.naoRetirados,
        },
      ];

      setDadosRetirados(dadosRetirados);
      setDadosDosObjetos(dadosDosObjetos);
      setDados(dados);
      setTotalObjetos(totalItens);
    }
    fetchDataRetirada();
  }, [campus]);

  return (
    <div className="flex w-full items-center flex-col">
      <div className="w-[95%] border-b pb-4 border-gray-300 flex justify-between items-center  px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800"> Visão Geral</h1>
        <div className="flex items-center gap-4">
          <div className="flex p-1 gap-x-2 shadow border border-slate-100 rounded-b-md w-min">
            <MapIcon />
            <select
              name="date"
              id="date"
              onChange={(e) => setCampus(e.target.value)}
              value={campus}
            >
              <option value="0">Todos os Campus</option>
              <option value="1">COTIL / FT - Campus 1</option>
              <option value="2">FCA - Campus 2</option>
            </select>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-6 flex flex-col  shadow overflow-hidden pb-3">
        <div className="border-t-4 pr-15  rounded-tl-md rounded-tr-md p-3 border-slate-600 bg-slate-100 w-fit shadow">
          <h2>Total De Objetos</h2>
          <h1 className="text-4xl font-medium">{totalObjetos}</h1>
        </div>
        <div className="h-full w-full max-h-screen bg-slate-100 shadow flex flex-col p-3">
          <div className="flex-1 w-full rounded-md shadow overflow-hidden">
            <Grafico key={campus} dados={dados} />
          </div>
          <div className="flex w-full gap-4 mt-4">
            <div className="h-[210px] w-fit bg-slate-100 rounded-md p-2 shadow border border-slate-200">
              <GraficoPizza key={campus} dados={dadosRetirados} />
            </div>
            <div className="h-[210px] w-full bg-slate-100 rounded-md p-2 shadow flex justify-center border border-slate-100">
              <GraficoObjetos key={campus} dados={dadosDosObjetos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
