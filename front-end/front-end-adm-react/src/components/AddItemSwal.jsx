/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CopyPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export function AddItemSwal() {
  const [campus, setCampus] = useState(0);
  const [dataEncontrado, setDataEncontrado] = useState("");
  const [local, setLocal] = useState("");
  const [imagemUrl, setImagemUrl] = useState(null);
  const [setPreviewImage] = useState("/photos/uploadImg.jpg");
  const [data, setData] = useState([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (campus == 0) return;
      try {
        const response = await fetch(
          `https://finditapi.felipedepauladev.site/api/campus/${campus}`,
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

  async function setarNomeDescricao() {
    const token = sessionStorage.getItem("token");
    const responseToken = await fetch(
      "https://finditapi.felipedepauladev.site/auth-enter",
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
      Swal.fire({
        title: "Digite o nome do Item",
        html: '<input id="nome" type="text" maxlength="25" placeholder="Digite o nome aqui..." class="w-[80%] m-auto pl-4 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#006400",
        cancelButtonColor: "#696969",
      }).then((resultado) => {
        if (resultado.isConfirmed) {
          const text = document.getElementById("nome").value.trim();
          if (text !== "") {
            setNome(text.toLowerCase());
            selectDate();
          } else {
            Swal.fire({
              icon: "warning",
              title: "Nome não pode estar vazio!",
              timer: 2500,
              confirmButtonColor: "#696969",
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Este usuário não possui permissão para acessar esta área. Por favor, entre em contato com o administrador.",
        confirmButtonText: "Entendi",
        confirmButtonColor: "#696969",
      });
    }
  }

  function selectDate() {
    Swal.fire({
      title: "Selecione A Data:",
      imageUrl:
        "https://i.pinimg.com/564x/b7/57/a5/b757a5ab796c38bb56b01a78edb69aca.jpg",
      imageHeight: "100px",
      imageWidth: "100px",
      html: `
    <label for="date" class="text-lg font-medium text-gray-700">Data:</label>
    <input type="date" id="date" required 
      class="px-4 py-2 rounded-md border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
  `,
      didOpen: () => {
        const dateInput = document.getElementById("date");

        dateInput.value = dataEncontrado || "";

        dateInput.addEventListener("input", (event) => {
          setDataEncontrado(event.target.value);
        });
      },
      showCancelButton: true,
      cancelButtonColor: "#696969",
      confirmButtonColor: "#006400",
    }).then((result) => {
      if (result.isConfirmed) {
        selectCampus();
      }
    });
  }

  function selectCampus() {
    Swal.fire({
      imageUrl:
        "https://icones.pro/wp-content/uploads/2021/04/icones-de-localisation-de-la-carte-noire.png",
      imageWidth: 200,
      imageHeight: "auto",
      title: "Selecione um Campus",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Campus 1 - Cotil | FT",
      denyButtonText: "Campus 2 - FCA",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#B22222",
      denyButtonColor: "#1E90FF",
      cancelButtonColor: "#696969",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        setCampus(1);
      } else if (resultado.isDenied) {
        setCampus(2);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Você não selecionou nenhum campus!",
          timer: 2500,
          confirmButtonColor: "#696969",
        });
      }
    });
  }

  useEffect(() => {
    function openForm() {
      if (data.length == 0 || campus == 0) return;
      Swal.fire({
        title: "Selecionar Local",
        html: `
          <label for="local" class="text-lg font-medium text-gray-700">Local:</label>
          <select id="local" required class="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            ${data
              .map(
                (option) =>
                  `<option value="${option.nome}">${option.descricao}</option>`
              )
              .join("")}
          </select>
        `,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#00BFFF",
        cancelButtonColor: "#696969",
        didOpen: () => {
          setTimeout(() => {
            const localSelect = document.getElementById("local");

            if (localSelect) {
              localSelect.value = local || "";
              localSelect.addEventListener("change", (event) => {
                setLocal(event.target.value);
              });
            }
          }, 100);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          addImg();
        }
      });
    }
    openForm();
  }, [campus, data]);

  function addImg() {
    let selectedFile = null;
    let previewUrl = "/photos/uploadImg.jpg";

    Swal.fire({
      title: "Adicione Uma Imagem",
      html: `
        <div class="flex flex-col items-center w-full">
          <div id="preview-container"
            class="border-dashed border-2 rounded-xl border-gray-400 p-2 h-[300px] w-[300px] flex items-center justify-center overflow-hidden cursor-pointer bg-white shadow-md"
          >
            <img id="preview-img" src="${previewUrl}" class="rounded-lg object-cover w-full h-full" />
          </div>
          <div class="flex items-center gap-3 p-3 mt-4 border-2 border-gray-400 border-dashed rounded-xl bg-gray-50 w-[300px] justify-center shadow">
            <p id="file-status" class="text-lg text-gray-700">Nenhuma Imagem</p>
            <button id="remove-img" class="text-red-500 hover:text-red-700 cursor-pointer">🗑️</button>
          </div>
          <input type="file" id="file-input" accept="image/*" class="hidden" />
          <button id="upload-btn" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            Escolher Imagem
          </button>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#00BFFF",
      cancelButtonColor: "#696969",
      didOpen: () => {
        const fileInput = document.getElementById("file-input");
        const previewImg = document.getElementById("preview-img");
        const fileStatus = document.getElementById("file-status");
        const removeBtn = document.getElementById("remove-img");
        const uploadBtn = document.getElementById("upload-btn");

        uploadBtn.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            selectedFile = file;
            previewImg.src = URL.createObjectURL(file);
            fileStatus.innerText = "Imagem Selecionada";
          }
        });

        removeBtn.addEventListener("click", () => {
          selectedFile = null;
          previewImg.src = previewUrl;
          fileStatus.innerText = "Nenhuma Imagem";
          fileInput.value = "";
        });
      },
    }).then((result) => {
      if (result.isConfirmed && selectedFile) {
        setImagemUrl(selectedFile);
      }
    });
  }

  useEffect(() => {
    async function addItemFunction() {
      if (imagemUrl == null) return;
      const formData = new FormData();
      const folderType = "uploads";
      formData.append("nome_item", nome);
      formData.append("data_encontrado", dataEncontrado);
      formData.append("local_encontrado", local);
      formData.append("imagem_url", imagemUrl);
      formData.append("campus", campus);
      formData.append("folder", folderType);

      try {
        const response = await fetch(
          "https://finditapi.felipedepauladev.site/adicionar",
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

        if(response){
          Swal.fire({
            title: "Sucesso!",
            text: "Item adicionado com sucesso!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        Swal.fire({
          title: "Erro!",
          text: `Erro ao enviar dados: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    addItemFunction();
  }, [imagemUrl]);

  return (
    <button
      className="space-y-6 font-normal text-[15px] flex items-center gap-2 w-full pl-4 p-2 hover:cursor-pointer"
      onClick={setarNomeDescricao}
    >
      <CopyPlus /> Adicionar Objeto
    </button>
  );
}
