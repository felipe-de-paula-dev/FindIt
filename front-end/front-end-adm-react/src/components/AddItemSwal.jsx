/* eslint-disable no-unused-vars */
import { CopyPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export function AddItemSwal() {
  const [campus, setCampus] = useState("");
  const inputRef = useRef(null);
  const [nomeItem, setNomeItem] = useState("");
  const [dataEncontrado, setDataEncontrado] = useState("");
  const [local, setLocal] = useState("");
  const [imagemUrl, setImagemUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState("/photos/uploadImg.jpg");
  const [data, setData] = useState([]);

  function updateCampus(event) {
    setCampus(event.target.value);
    openForm();
  }

  function getLocaisOptions() {
    if (campus === "1" || campus === "2") {
      return data
        .map(
          (option, index) => `
        <option key="${index}" value="${option.nome}" ${
            option.disabled ? "disabled" : ""
          }>
          ${option.descricao}
        </option>
      `
        )
        .join("");
    } else {
      return `<option value="" disabled selected>Selecione um campus válido</option>`;
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    setImagemUrl(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage("/photos/uploadImg.jpg");
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (campus == 0) return;
      try {
        const response = await fetch(
          `https://findit-08qb.onrender.com/api/campus/${campus}`,
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

  async function addItemFunction() {
    const token = sessionStorage.getItem("token");
    const responseToken = await fetch(
      "https://findit-08qb.onrender.com/auth-enter",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const dataToken = await responseToken.json();
    if (dataToken.cargoId.cargoId == 1 || dataToken.cargoId.cargoId == 3) {
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
        setImagemUrl(null);
        setCampus("");
        inputRef.current.value = "";
        setPreviewImage("/photos/uploadImg.jpg");

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
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Este usuário não possui permissão para acessar esta área. Por favor, entre em contato com o administrador.",
        confirmButtonText: "Entendi",
      });
    }
  }

  const adicionarItem = () => {
    function openForm() {
      Swal.fire({
        title: "Adicionar Item",
        html: `
          <form id="meuForm" class="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-md" onSubmit="event.preventDefault();">
            <label for="nome_item" class="text-lg font-medium text-gray-700">Nome do Item:</label>
            <input type="text" id="nome_item" value="${nomeItem}" maxLength="25" oninput="setNomeItem(event.target.value)" placeholder="Digite o nome do item" required class="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    
            <label for="date" class="text-lg font-medium text-gray-700">Data:</label>
            <input type="date" id="date" value="${dataEncontrado}" oninput="setDataEncontrado(event.target.value)" required class="px-4 py-2 rounded-md border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    
            <label for="campus" class="text-lg font-medium text-gray-700">Campus:</label>
            <select name="campus" class="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" value="${campus}" onchange="updateCampus(event)">
              <option value="">Selecione o Campus</option>
              <option value="1">Campus 1 - Cotil / FT</option>
              <option value="2">Campus 2 - FCA</option>
            </select>
    
            <label for="local" class="text-lg font-medium text-gray-700">Local:</label>
            <select id="local" value="${local}" onchange="setLocal(event.target.value)" required class="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
              ${getLocaisOptions()}
            </select>
    
            <label for="imagem_url" class="text-lg font-medium text-gray-700">Imagem:</label>
            <input type="file" id="imagem_url" accept="image/*" onchange="handleFileUpload(event)" required class="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </form>
        `,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: "#00BFFF",
        cancelButtonColor: "#696969",
        didOpen: () => {
          const form = document.getElementById("meuForm");
        },
      }).then((result) => {
        if (result.isConfirmed) {
          addItemFunction();
        }
      });
    }
  };

  return (
    <button
      className="space-y-6 font-normal text-[15px] flex items-center gap-2 w-full pl-4 p-2 hover:cursor-pointer"
      onClick={adicionarItem}
    >
      <CopyPlus /> Adicionar Objeto
    </button>
  );
}
