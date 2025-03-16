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

export function Grafico({ dados }) {
  const cores = [
    { cor: "#C0392B", nome: "Vermelho Escuro" },
    { cor: "#27AE60", nome: "Verde Escuro" },
    { cor: "#2980B9", nome: "Azul Escuro" },
    { cor: "#8E44AD", nome: "Roxo Escuro" },
    { cor: "#F39C12", nome: "Amarelo Escuro" },
    { cor: "#1ABC9C", nome: "Verde Água Escuro" },
  ];

  const data = {
    labels: dados.map((item) =>
      item.localizacao ? item.localizacao : "Sem Local"
    ),
    datasets: [
      {
        data: dados.map((item) => item.count),
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
  return <Bar data={data} options={options} />;
}

Grafico.propTypes = {
  dados: PropTypes.arrayOf(
    PropTypes.shape({
      local: PropTypes.string.isRequired,
      quantidade: PropTypes.number.isRequired,
    })
  ).isRequired,
};
