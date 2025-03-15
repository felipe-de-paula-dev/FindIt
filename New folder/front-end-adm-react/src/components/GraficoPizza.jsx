import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export function GraficoPizza({ dados }) {
  const dataPizza = {
    labels: dados.map((item) => item.local),
    datasets: [
      {
        label: "Itens Perdidos",
        data: dados.map((item) => item.quantidade),
        backgroundColor: ["rgba(0, 153, 18, 0.8)", "rgba(153, 0, 0, 0.8)"],
        borderColor: ["rgba(0, 153, 18, 0.8)", "rgba(153, 0, 0, 0.8)"],
        borderWidth: 1,
      },
    ],
  };

  const optionsPizza = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Distribuição de Itens Perdidos por Local",
      },
      legend: {
        display: true,
        position: "right",
        align: "right",
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    cutout: "60%",
  };
  return <Pie data={dataPizza} options={optionsPizza} />;
}

GraficoPizza.propTypes = {
  dados: PropTypes.arrayOf(
    PropTypes.shape({
      local: PropTypes.string.isRequired,
      quantidade: PropTypes.number.isRequired,
    })
  ).isRequired,
};
