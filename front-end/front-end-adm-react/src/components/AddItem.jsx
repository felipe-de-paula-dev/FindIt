import { CirclePlus, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import Swal from "sweetalert2";

export function AddItem() {
  const [campus, setCampus] = useState("");
  const inputRef = useRef(null);
  const [nomeItem, setNomeItem] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");
  const [local, setLocal] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [previewImage, setPreviewImage] = useState("/photos/uploadImg.jpg");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (campus == 0) return;
      try {
        const response = await fetch(
          `http://localhost:3333/api/campus/${campus}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        setData(data);
      } catch (err) {
        console.log("Ocorreu um erro:", err);
      }
    }
    fetchData();
  }, [campus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responseToken = await fetch("http://localhost:3333/auth-enter", {
      method: "GET",
      credentials: "include",
    });
    const dataToken = await responseToken.json();
    if (dataToken.code.cargoId == 1 || dataToken.code.cargoId == 3) {
      setIsButtonDisabled(true);

      const formData = new FormData();
      const folderType = "uploads";
      formData.append("nome_item", nomeItem);
      formData.append("data_encontrado", dataEncontrado);
      formData.append("local_encontrado", local);
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
        setImagemUrl("");
        setCampus("");
        inputRef.current.value = "";
        setPreviewImage("/photos/uploadImg.jpg");

        Swal.fire({
          title: "Sucesso!",
          text: "Item adicionado com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setIsButtonDisabled(false);
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        Swal.fire({
          title: "Erro!",
          text: `Erro ao enviar dados: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsButtonDisabled(false);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Este usuário não possui permissão para acessar esta área. Por favor, entre em contato com o administrador.",
        confirmButtonText: "Entendi",
      });
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-10vh)] items-center mt-4 pb-5 flex-col overflow-auto">
      <h1 className="text-4xl font-semibold mb-6 text-gray-800 flex items-center gap-4">
        Adicione o Item <CirclePlus size={32} className="text-gray-800" />
      </h1>
      <div className="flex flex-col flex-wrap items-center gap-10 max-w-4xl w-full xl:flex-row">
        <div className="flex flex-col items-center w-full md:w-[40%]">
          <div
            className="border-dashed border-2 rounded-xl border-gray-400 p-2 h-[400px] w-[400px] flex items-center justify-center overflow-hidden cursor-pointer bg-white shadow-md"
            onClick={() => document.getElementById("imagem_url").click()}
          >
            <img
              src={previewImage}
              className="rounded-lg object-cover w-full h-full"
              alt="Imagem selecionada"
            />
          </div>

          <div className="flex items-center gap-3 p-3 mt-4 border-2 border-gray-400 border-dashed rounded-xl bg-gray-50 w-[400px] justify-center shadow">
            <p className="text-lg text-gray-700">
              {imagemUrl ? "Imagem Selecionada" : "Nenhuma Imagem"}
            </p>
            <Trash
              className="hover:text-red-500 transition-all transform cursor-pointer"
              onClick={() => {
                setImagemUrl("");
                inputRef.current.value = "";
                setPreviewImage("/photos/uploadImg.jpg");
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-[50%]">
          <form
            id="meuForm"
            className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="nome_item"
              className="text-lg font-medium text-gray-700"
            >
              Nome do Item:
            </label>
            <input
              type="text"
              id="nome_item"
              value={nomeItem}
              maxLength={25}
              onChange={(e) => setNomeItem(e.target.value)}
              placeholder="Digite o nome do item"
              required
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label htmlFor="date" className="text-lg font-medium text-gray-700">
              Data:
            </label>
            <input
              type="date"
              id="date"
              value={dataEncontrado}
              onChange={(e) => setDataEncontrado(e.target.value)}
              required
              className="px-4 py-2 rounded-md border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label
              htmlFor="local"
              className="text-lg font-medium text-gray-700"
            >
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
              <option value="1">Campus 1 - Cotil / FT</option>
              <option value="2">Campus 2 - FCA</option>
            </select>

            <select
              id="local"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {campus === "1" || campus === "2" ? (
                data.map((option, index) => (
                  <option
                    key={index}
                    value={option.nome}
                    disabled={option.disabled}
                  >
                    {option.descricao}
                  </option>
                ))
              ) : (
                <option value="" disabled selected>
                  Selecione um campus válido
                </option>
              )}
            </select>

            <label
              htmlFor="imagem_url"
              className="text-lg font-medium text-gray-700"
            >
              Imagem:
            </label>
            <input
              ref={inputRef}
              type="file"
              id="imagem_url"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImagemUrl(file);
                if (file) {
                  setPreviewImage(URL.createObjectURL(file));
                } else {
                  setPreviewImage("/photos/uploadImg.jpg");
                }
              }}
              required
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              disabled={isButtonDisabled}
              className="mt-4 py-2 bg-red-600 text-white transition-all rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 text-center flex justify-center"
            >
              {isButtonDisabled == true ? (
                <Loader2 className="animate-loading" />
              ) : (
                "Adicionar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
