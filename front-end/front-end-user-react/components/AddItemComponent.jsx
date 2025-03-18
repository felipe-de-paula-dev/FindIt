import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useRef } from "react";
import Swal from "sweetalert2";

const Campus1 = [
  { value: "", label: "Escolha uma Opção" },
  { value: "Sala", label: "Sala de Aula" },
  { value: "Biblioteca", label: "Biblioteca" },
  { value: "Portaria1", label: "Portaria Principal" },
  { value: "Portaria2", label: "Portaria Secundária" },
  { value: "RUCotil", label: "Restaurante Universitário" },
  { value: "Patio", label: "Pátio" },
  { value: "Faculdade", label: "FT - Faculdade" },
  { value: "Outro", label: "Outros" },
];

const Campus2 = [
  { value: "", label: "Escolha uma Opção" },
  { value: "Sala", label: "Sala de Aula" },
  { value: "LabMateriais", label: "Laboratório de Materiais" },
  { value: "LabDisturbios", label: "Laboratório de Distúrbios" },
  { value: "Biblioteca", label: "Biblioteca" },
  { value: "Congregacao", label: "Sala de Congregação" },
  { value: "Portaria1", label: "Portaria Principal" },
  { value: "Portaria2", label: "Portaria Secundária" },
  { value: "PortariaCarros", label: "Portaria Carros" },
  { value: "RURestaurante", label: "Restaurante Universitário" },
  { value: "Patio", label: "Pátio" },
  { value: "Outro", label: "Outros" },
];

export function AddItemComponent() {
  const [campus, setCampus] = useState("");
  const inputRef = useRef(null);
  const [nomeItem, setNomeItem] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");
  const [local, setLocal] = useState("");
  const [extraLocal, setExtraLocal] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let localItem = local === "outro" ? extraLocal : local;

    const formData = new FormData();
    const folderType = "uploads";
    formData.append("nome_item", nomeItem);
    formData.append("data_encontrado", dataEncontrado);
    formData.append("local_encontrado", localItem);
    formData.append("imagem_url", imagemUrl);
    formData.append("campus", campus);
    formData.append("folder", folderType);
    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/adicionar",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erro na resposta do servidor");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      setNomeItem("");
      setDataEncontrado("");
      setLocal("");
      setExtraLocal("");
      setImagemUrl("");
      setCampus("");
      inputRef.current.value = "";

      Swal.fire({
        title: "Sucesso!",
        text: "Item adicionado com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Erro ao enviar dados:", error);

      Swal.fire({
        title: "Erro!",
        text: `Erro ao enviar dados: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-[100%] border-t border-slate-300 rounded-md"></div>
      <h1 className="text-3xl font-semibold text-slate-900 mt-5 mb-2 flex items-center gap-4">
        Adicione o Item
        <CirclePlus size={32} className="mt-1 text-slate-900" />
      </h1>
      <form
        id="meuForm"
        className="flex flex-col h-full gap-4 bg-gray-100-100 p-6 rounded-lg  w-full sm:w-96"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="nome_item"
          className="text-lg font-medium text-gray-600"
        >
          Nome do Item:
        </label>
        <input
          type="text"
          id="nome_item"
          value={nomeItem}
          onChange={(e) => setNomeItem(e.target.value)}
          placeholder="Nome"
          required
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label htmlFor="date" className="text-lg font-medium text-gray-600">
          Data:
        </label>
        <input
          type="date"
          id="date"
          value={dataEncontrado}
          onChange={(e) => setDataEncontrado(e.target.value)}
          required
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label htmlFor="local" className="text-lg font-medium text-gray-600">
          Local:
        </label>
        <select
          name="campus"
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          defaultValue=""
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
        >
          <option value="">Selecione o Campus</option>
          <option value="1">Campus 1 - Cotil</option>
          <option value="2">Campus 2 - FCA</option>
        </select>
        <select
          id="local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {campus === "1" ? (
            Campus1.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          ) : campus === "2" ? (
            Campus2.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))
          ) : (
            <option value="" disabled selected>
              Selecione um campus válido
            </option>
          )}
        </select>

        <label
          htmlFor="extra_local"
          id="label_extra_local"
          className="text-lg font-medium text-gray-600"
        >
          Informe o Local:
        </label>
        <input
          type="text"
          id="extra_local"
          value={extraLocal}
          onChange={(e) => setExtraLocal(e.target.value)}
          placeholder={
            local === "Outro"
              ? "Digite o Local"
              : "Campo Exclusivo Para Local = 'Outros'"
          }
          disabled={local !== "Outro"}
          maxLength="10"
          className={`px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            local === "outro" ? "text-black" : "text-slate-500"
          }`}
        />

        <label
          htmlFor="imagem_url"
          className="text-lg font-medium text-gray-600"
        >
          Imagem:
        </label>
        <input
          ref={inputRef}
          type="file"
          id="imagem_url"
          onChange={(e) => setImagemUrl(e.target.files[0])}
          required
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="mt-4 py-2 bg-red-600 text-white transition-all rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
}
