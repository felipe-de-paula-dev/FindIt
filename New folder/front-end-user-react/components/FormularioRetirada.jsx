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
      const response = await fetch("http://localhost:3333/itens/retiradas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosRetirada),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar a retirada");
      }
      Swal.fire({
        title: "Solicitação de retirada enviada!",
        text: "Dirija-Se Ao Local Enviado Ao Seu Email Para Efetuar A Retirada",
        icon: "success",
        timer: 1500,
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
      <h1 className="text-2xl font-semibold">Confirme a Retirada</h1>
      <div className="flex flex-col w-[100%] sm:w-[60%] mt-5 items-center gap-2">
        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="cl"
            className="font-semibold flex items-center text-xl text-slate-800"
          >
            CL:
          </label>
          <input
            type="number"
            id="cl"
            maxLength={6}
            value={cl}
            onChange={(e) => setCl(e.target.value)}
            required
            className="border-b rounded-md p-1 outline-none focus:bg-red-50 focus:border-red-600 w-[90%]"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="nome"
            className="font-semibold flex items-center text-xl text-slate-800"
          >
            Nome:
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="border-b rounded-md p-1 outline-none focus:bg-red-50 focus:border-red-600 w-[90%]"
          />
        </div>
        <div className="w-full flex flex-col items-center">
          <label
            htmlFor="email"
            className="font-semibold flex items-center text-xl text-slate-800"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-b rounded-md p-1 outline-none focus:bg-red-50 focus:border-red-600 w-[90%]"
          />
        </div>
        <button
          type="button"
          onClick={confirmarretirada}
          className="bg-red-600 p-1 w-[90%] h-[40px] rounded-2xl text-white mt-5 hover:cursor-pointer"
        >
          Confirmar Retirada
        </button>
      </div>
    </div>
  );
}
