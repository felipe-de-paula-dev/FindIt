import { useEffect, useState } from "react";

export function DescricaoItem({ nome }) {
  const [descricao, setDescricao] = useState("Carregando...");
  useEffect(() => {
    async function fetchDescricao() {
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/api/descricao/${nome}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setDescricao(data.descricao[0].descricao || "Não Encontrado");
      } catch (error) {
        console.log("Descrição não encontrada", error);
        setDescricao("Não Encontrado");
      }
    }
    fetchDescricao();
  }, [nome]);

  return descricao;
}
