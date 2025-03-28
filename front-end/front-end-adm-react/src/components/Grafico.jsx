/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Grafico({ dados }) {
  const [data, setData] = useState([]);

  async function fetchDescricao(nome) {
    try {
      const response = await fetch(
        `https://findit-08qb.onrender.com/api/descricao/${nome}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      return data.descricao[0].descricao;
    } catch (error) {
      console.log("Descrição não encontrada", error);
      return nome;
    }
  }

  useEffect(() => {
    async function createData() {
      const dadosEffect = await Promise.all(
        dados.map(async (item) => ({
          localizacao: await fetchDescricao(item.localizacao.toLowerCase()),
          count: item.count,
        }))
      );
      setData(dadosEffect);
    }
    createData();
  }, [dados]);

  const cores = [
    { cor: "#C0392B", nome: "Vermelho Escuro" },
    { cor: "#27AE60", nome: "Verde Escuro" },
    { cor: "#2980B9", nome: "Azul Escuro" },
    { cor: "#8E44AD", nome: "Roxo Escuro" },
    { cor: "#F39C12", nome: "Amarelo Escuro" },
    { cor: "#1ABC9C", nome: "Verde Água Escuro" },
  ];

  const dataLocal = {
    labels: data.map((item) => item.localizacao || "Sem Local"),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: cores.map((item) => item.cor),
        borderColor: cores.map((item) => item.cor),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Locais Com Mais Itens Encontrados",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        categoryPercentage: 0.5,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  return <Bar data={dataLocal} options={options} />;
}
