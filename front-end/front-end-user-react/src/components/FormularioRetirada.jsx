import { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Mail, User, ShieldCheck } from "lucide-react";

export function FormularioRetirada({ setCampus }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  const [cl, setCl] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  async function sendMail(to) {
    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/api/sendMail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: to,
            subject: "Sua Retirada Foi Agendada! - FindIt",
            text: "Por Favor Dirija-se A Secretaria Do Cotil / FT Para A Retirada",
            html: {
              header: "<h1>Bem-vindo ao FindIt!</h1>",
              greeting: `<p>Olá, ${nome}</p>`,
              instructions: `<p><strong>Por Favor Dirija-se A Secretaria Do(a): ${
                setCampus == 1 ? "Cotil" : "Fca"
              } Para A Retirada Do Item</strong></p>`,
              closing:
                "<p>Com os melhores cumprimentos,<br><em>Equipe FindIt</em></p>",
              link: "<p><a href='https://find-it-user.vercel.app/' target='_blank'>Acesse nosso site</a></p>",
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(errorData.ErroEmail || response.statusText);
        const errorData = await response.json();
        throw new Error(
          `Erro ao enviar e-mail: ${errorData.ErroEmail || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Email enviado com sucesso:", data);
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error.message);
    }
  }

  async function confirmarretirada() {
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

    if (!id) {
      Swal.fire({
        title: "Erro",
        text: "ID do item não definido",
        icon: "error",
        timer: 1500,
      });
      return;
    }

    const dadosRetirada = { id_item: id, nome, cl, email };

    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/itens/retiradas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosRetirada),
        }
      );

      if (!response.ok) throw new Error("Erro ao registrar a retirada");
      Swal.fire({
        title: "Solicitação enviada!",
        text: "Verifique seu e-mail para mais informações.",
        icon: "success",
        timer: 5000,
        confirmButtonColor: "#696969",
      });
      await sendMail(email);
      setCl("");
      setNome("");
      setEmail("");
    } catch (error) {
      console.error("Erro ao registrar a retirada:", error);
      Swal.fire({
        title: "Erro",
        text: "Já existe uma solicitação para esse item!",
        icon: "error",
        timer: 1500,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full text-center mt-9 mb-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Confirme a Retirada
      </h1>
      <div className="flex flex-col w-[80%] sm:w-2/4 mt-5 gap-6">
        <div className="relative w-full">
          <ShieldCheck
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="number"
            placeholder="CL"
            max={999999}
            value={cl}
            onChange={(e) => e.target.value.length < 8 && setCl(e.target.value)}
            className="pl-10 pr-4 rounded w-full py-3 border-b-2 border-gray-300 outline-none focus:border-red-500 focus:bg-red-200"
          />
        </div>

        <div className="relative w-full">
          <User
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Nome"
            maxLength={20}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="pl-10 pr-4 rounded w-full py-3 border-b-2 border-gray-300 outline-none focus:border-red-500 focus:bg-red-200"
          />
        </div>

        <div className="relative w-full">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-4 rounded w-full py-3 border-b-2 border-gray-300 outline-none focus:border-red-500 focus:bg-red-200"
          />
        </div>

        <button
          onClick={confirmarretirada}
          className="bg-red-600 hover:bg-red-700 w-full h-[50px] rounded text-white"
        >
          Confirmar Retirada
        </button>
      </div>
    </div>
  );
}
