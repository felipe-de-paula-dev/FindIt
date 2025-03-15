let Mapa = "";
let mapa;

let idItemRetirada;

function fecharMapa() {
  document.getElementById("mapaObjeto").style.display = "none";
}

function retirarMapa(id) {
  document.getElementById("mapaObjeto").style.display = "flex";
  fetch(`http://localhost:3333/usuarios/Disponiveis/mapa/${id}`)
    .then((response) => response.json())
    .then((mapa) => {
      const mapaLocalizacao = mapa[0].local_encontrado.toLowerCase();
      Mapa = mapaLocalizacao.startsWith("sala") ? "sala" : mapaLocalizacao;
      mapaRetirada(Mapa);
      idItemRetirada = id;
    })
    .catch((error) => console.error("Erro ao buscar os dados:", error));
}

function exibirFormularioConfirmacao() {
  const formularioDiv = document.getElementById("formularioRetirada");
  formularioDiv.style.display = "block";
  document.getElementById("cl").value = "";
  document.getElementById("nome").value = "";
}

function formatarData(data) {
  const dataObj = new Date(data);

  if (isNaN(dataObj)) {
    return "Data inválida";
  }

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  return `${mes}/${dia}/${ano}`;
}

function adicionaritem() {
  window.location.href = "Adicionar.html";
}

window.onload = function () {
  aprovados();
};

function aprovados() {
  const conteudo = document.getElementById("objetosAprovados");
  fetch("http://localhost:3333/usuarios/Disponiveis")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((objeto) => {
        const div = document.createElement("div");
        const dataAtual = objeto.data_encontrado;
        const dataFormatada = formatarData(dataAtual);
        div.className = "Item";
        div.innerHTML = `
      <p><strong>Nome:</strong> ${objeto.nome_item}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Local:</strong> ${objeto.local_encontrado}</p>
      <p><strong>Imagem:</strong></p>
      <img src="${objeto.imagem_url}" alt="Imagem do item" style="max-width: 200px;">
      <button onclick=retirarMapa(${objeto.id_item})>Retirar Item</button>`;
        conteudo.appendChild(div);
      });
    })
    .catch((error) => console.error("Erro ao buscar os dados:", error));
}

document.getElementById("meuForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const local = document.getElementById("local").value;
  const extra = document.getElementById("extra_local").value;
  let localItem;

  if (local == "outro") {
    localItem = extra;
  } else {
    localItem = local;
  }

  const formData = new FormData();
  formData.append("nome_item", document.getElementById("nome_item").value);
  formData.append("data_encontrado", document.getElementById("date").value);
  formData.append("local_encontrado", localItem);
  formData.append("imagem_url", document.getElementById("imagem_url").files[0]);

  try {
    const response = await fetch("http://localhost:3333/adicionar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();
    console.log("Resposta do servidor:", data);
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    alert(error.message);
  }
});

async function confirmarretirada() {
  const cl = document.getElementById("cl").value;
  const nome = document.getElementById("nome").value;

  if (cl == "" || nome == "") {
    window.alert("Digite Os Dados Corretamente!");
    return;
  }

  if (!idItemRetirada) {
    alert("ID do item não definido");
    return;
  }

  window.alert(idItemRetirada);

  const dadosRetirada = {
    id_item: idItemRetirada,
    nome: nome,
    cl: cl,
  };

  try {
    const response = await fetch("http://localhost:3333/usuarios/retiradas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosRetirada),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar a retirada");
    }

    if (response.ok) {
      window.alert("Solicitação De Retirada Enviada!");
    }

    const data = await response.json();
    console.log("Retirada confirmada:", data);
    document.getElementById("formularioRetirada").style.display = "none";
    document.getElementById("mapaObjeto").style.display = "none";
  } catch (error) {
    console.error("Erro ao registrar a retirada:", error);
    alert(error.message);
  }
}

function retirarItem(id) {
  const agora = new Date();
  const dataHoraISO = agora.toISOString();
  const dataFormatada = dataHoraISO.replace("T", " ").slice(0, 19);
  let nomePessoal = prompt("Digite o Nome: ");

  if (nomePessoal === null || nomePessoal.trim() === "") {
    window.alert("Digite o nome corretamente!");
    return;
  } else {
    const data = {
      data_movimentacao: dataFormatada,
      retirado_por: nomePessoal.trim(),
    };

    fetch(`http://localhost:3333/retirarItem/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

// Mapa

function mapaRetirada(Mapa) {
  console.log(Mapa);

  const locais = {
    sala: [-22.562426, -47.425279],
    biblioteca: [-22.562178, -47.423553],
    portaria: [-22.562616904516098, -47.42349949548547],
    patio: [-22.562278145525053, -47.42476621021813],
    faculdade: [-22.561768, -47.423838],
  };

  let localEncontrado;

  if (!Object.keys(locais).includes(Mapa)) {
    localEncontrado = [-22.562424, -47.425008];
  } else {
    localEncontrado = locais[Mapa];
  }

  let retirada = [-22.562424, -47.425008];

  if (mapa) {
    mapa.remove();
  }

  mapa = L.map("mapa").setView(localEncontrado, 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(mapa);

  const iconeAlfinete = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const iconeCasa = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
    iconSize: [40, 40],
    iconAnchor: [25, 50],
  });

  L.marker(localEncontrado, { icon: iconeAlfinete })
    .addTo(mapa)
    .bindPopup("<b>Item Encontrado Aqui!</b>");

  L.marker(retirada, { icon: iconeCasa })
    .addTo(mapa)
    .bindPopup("<b>Local de Retirada</b>");

  const legenda = L.control({ position: "bottomleft" });

  legenda.onAdd = function () {
    const div = L.DomUtil.create("div", "legenda");
    div.innerHTML = `
            <strong>Legenda</strong><br>
            <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" width="20" style="margin-top:7px"> Item Encontrado<br>
            <img src="https://cdn-icons-png.flaticon.com/512/484/484167.png" width="20"> Local de Retirada
        `;
    div.style.backgroundColor = "white";
    div.style.padding = "8px";
    div.style.border = "1px solid black";
    div.style.borderRadius = "5px";
    div.style.fontSize = "14px";
    return div;
  };

  legenda.addTo(mapa);
}
