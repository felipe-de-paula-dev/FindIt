import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function GraficoObjetos({ dados }) {
  const cores = [
    { cor: "#C0392B", nome: "Vermelho Escuro" },
    { cor: "#27AE60", nome: "Verde Escuro" },
    { cor: "#2980B9", nome: "Azul Escuro" },
    { cor: "#8E44AD", nome: "Roxo Escuro" },
    { cor: "#F39C12", nome: "Amarelo Escuro" },
    { cor: "#1ABC9C", nome: "Verde Água Escuro" },
  ];
  const dataBarras = {
    labels: dados.map((item) => item.nome_item),
    datasets: [
      {
        label: "Itens Perdidos",
        data: dados.map((item) => item.count),
        backgroundColor: cores.map((item) => item.cor),
        borderColor: cores.map((item) => item.cor),
        borderWidth: 1,
      },
    ],
  };

  const optionsBarras = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: "Itens Mais Perdidos",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };
  return <Bar data={dataBarras} options={optionsBarras} />;
}

GraficoObjetos.propTypes = {
  dados: PropTypes.arrayOf(
    PropTypes.shape({
      local: PropTypes.string.isRequired,
      quantidade: PropTypes.number.isRequired,
    })
  ).isRequired,
};
