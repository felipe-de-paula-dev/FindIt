import { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export function FormularioRetirada() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const [cl, setCl] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  async function confirmarretirada() {
    let idItemRetirada = id;

    if (cl === "" || nome === "" || email === "" || nome.length < 2) {
      Swal.fire({
        title: "Dados Insuficientes",
        text: "Digite os dados corretamente!",
        icon: "error",
        confirmButtonColor: "#006400",
      });
      return;
    }

    if (cl.length > 6) {
      Swal.fire({
        title: "Dados Errados",
        text: "Digite o CL corretamente!",
        icon: "error",
        confirmButtonColor: "#006400",
      });
      return;
    }

    if (!idItemRetirada) {
      Swal.fire({
        title: "Erro",
        text: "ID do item não definido",
        icon: "error",
        timer: 1500,
      });
      return;
    }

    const dadosRetirada = {
      id_item: idItemRetirada,
      nome: nome,
      cl: cl,
      email: email,
    };

    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/itens/retiradas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosRetirada),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar a retirada");
      }
      Swal.fire({
        title: "Solicitação de retirada enviada!",
        text: "Dirija-Se Ao Local Enviado Ao Seu Email Para Efetuar A Retirada",
        icon: "success",
        timer: 5000,
      });
      setCl("");
      setNome("");
    } catch (error) {
      console.error("Erro ao registrar a retirada:", error);
      Swal.fire({
        title: "Erro",
        text: "Já Existe uma solicitação de retirada para esse item!",
        icon: "error",
        timer: 1500,
      });
    }
  }

  return (
    <div className="flex items-center justify-center flex-col w-full text-center mt-9">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Confirme a Retirada
      </h1>
      <div className="flex flex-col w-[100%] sm:w-[60%] mt-5 items-center gap-6">
        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="cl"
            className="font-semibold text-xl text-slate-800 mb-2"
          >
            CL:
          </label>
          <input
            type="number"
            id="cl"
            max={999999}
            value={cl}
            onChange={(e) => {
              if (e.target.value.length < 8) {
                setCl(e.target.value);
              }
            }}
            required
            className="border-b border-gray-300 rounded-md p-2 w-[90%] outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
          />
        </div>

        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="nome"
            className="font-semibold text-xl text-slate-800 mb-2"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            maxLength={20}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="border-b border-gray-300 rounded-md p-2 w-[90%] outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
          />
        </div>

        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="email"
            className="font-semibold text-xl text-slate-800 mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-b border-gray-300 rounded-md p-2 w-[90%] outline-none focus:ring-2 focus:ring-red-600 transition duration-300"
          />
        </div>

        <button
          type="button"
          onClick={confirmarretirada}
          className="bg-red-600 p-3 w-[90%] h-[45px] rounded-full text-white mt-6 transition-all duration-300 transform hover:scale-105 hover:bg-red-700 hover:cursor-pointer"
        >
          Confirmar Retirada
        </button>
      </div>
    </div>
  );
}
