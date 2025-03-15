

function formatarData(data) {
    const dataObj = new Date(data);

    if (isNaN(dataObj)) {
        return 'Data inválida';
    }

    const dia = String(dataObj.getDate()).padStart(2, '0');  
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); 
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
}



var ctx = document.getElementById('resumoChart').getContext('2d');
 var myChart = new Chart(ctx, {
        type: 'pie',
            data: {
                labels: ['Não Retirados', 'Retirados'],
                datasets: [{
                    data: [5, 4],
                    backgroundColor: ['#CD5C5C', '#426B1F']
                }]
            }
});

// Função Para Adicionar Div - Objeto Pronto Para Retirada

function aprovados(){
    document.getElementById('urlSistema').innerText = '/ Inicio / Aprovados'
    document.getElementById('options').style.display = 'none'
    document.getElementById('resumo').style.display = 'none'

    document.getElementById('objetosAprovados').style.display = 'flex'

    const conteudo = document.getElementById('objetosAprovados');
    conteudo.innerHTML = '';
    fetch('http://localhost:3333/usuarios/Disponiveis') 
    .then(response => response.json()) 
    .then(data => {
      data.forEach(objeto => {
      const div = document.createElement("div");
      const dataAtual = objeto.data_encontrado
      const dataFormatada = formatarData(dataAtual)
      div.className = 'Item'
      div.innerHTML = `
      <p><strong>Nome:</strong> ${objeto.nome_item}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Local:</strong> ${objeto.local_encontrado}</p>
      <p><strong>Imagem:</strong></p>
      <img src="${objeto.imagem_url}" alt="Imagem do item" style="max-width: 200px;">`; 
      conteudo.appendChild(div);
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
  }

  // Função Para Adicionar Div - Objeto Pronto Para ser aprovado


  
function pendentes(){
    document.getElementById('urlSistema').innerText = '/ Inicio / Pendentes'
    document.getElementById('options').style.display = 'none'
    document.getElementById('resumo').style.display = 'none'

    document.getElementById('objetosPendentes').style.display = 'flex'

    const conteudo = document.getElementById('objetosPendentes');
    conteudo.innerHTML = '';
    fetch('http://localhost:3333/usuarios/Pendentes') 
    .then(response => response.json()) 
    .then(data => {
      data.forEach(objeto => {
      const div = document.createElement("div");
      const dataAtual = objeto.data_encontrado
      const dataFormatada = formatarData(dataAtual)
      div.className = 'Item'
      div.innerHTML = `
      <p><strong>Nome:</strong> ${objeto.nome_item}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Local:</strong> ${objeto.local_encontrado}</p>
      <p><strong>Imagem:</strong></p>
      <img src="${objeto.imagem_url}" alt="Imagem do item" style="max-width: 200px;">
      <button onclick="aprovar_item(${objeto.id_item})">Aprovar Item?</button>
      `; 
      conteudo.appendChild(div);
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
  }

   // Função Para Adicionar Div - Objeto Pronto Para ser retirado

  
function retirada(){
    document.getElementById('urlSistema').innerText = '/ Inicio / Retirada'
    document.getElementById('options').style.display = 'none'
    document.getElementById('resumo').style.display = 'none'
    document.getElementById('retiradaObjetos').style.display = 'flex'
    const conteudo = document.getElementById('retiradaObjetos');
    conteudo.innerHTML = '';
    fetch('http://localhost:3333/retirada') 
    .then(response => response.json()) 
    .then(data => {
      data.forEach(objeto => {
      const div = document.createElement("div");
      div.className = 'Item'
      div.innerHTML = `
      <p style="text-align: center"><strong>Nome Objeto:<br></strong> ${objeto.nomeObjeto}</p>
      <p style="text-align: center"><strong>Nome:<br></strong> ${objeto.nome}</p>
      <p><strong>Cl:</strong> ${objeto.cl}</p>
      <p><strong>Imagem do objeto:</strong></p>
      <img src="${objeto.imgUrl}" alt="Imagem do item" style="max-width: 200px;">
      <div>
      <button onclick="deletarRetirada(${objeto.id_retirada})" style="background-color:#B22222"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(255,255,255,1)"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg></button>
      <button onclick="aprovarRetirada(${objeto.id_retirada})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(250,250,250,1)"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg></button>
      </div>
      `; 
      conteudo.appendChild(div);
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
  }


  function inicio(){
    document.getElementById('urlSistema').innerText = '/ Inicio '
    document.getElementById('options').style.display = 'block'
    document.getElementById('resumo').style.display = 'flex'
    document.getElementById('objetosPendentes').style.display = 'none'
    document.getElementById('objetosAprovados').style.display = 'none'
    document.getElementById('retiradaObjetos').style.display = 'none'
  }

  
  // funcao para retirada da solicitacao


async function deletarRetirada(id){
    const response = await fetch(`http://localhost:3333/retirada/excluir/${id}`, {
        method: "DELETE",
    })
    if(response.ok){
        retirada();
    }
}


  // funcao para retirada do item


function deletar_item(id){
    fetch(`http://localhost:3333/usuarios/excluir/${id}`, {
        method: "DELETE",
    })
}


function aprovar_item(id){
    const reseponse = fetch(`http://localhost:3333/usuarios/pendentes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Disponível"
        })
    })
    window.alert('Item Aprovado')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Erro ao atualizar status:", error));
   if(reseponse.ok){
    aprovados();
   }
}


async function aprovarRetirada(id) {
  const response = fetch(`http://localhost:3333/retirada/aprovar/${id}`, {
    method: "PUT",
  })
  if(!response.ok){
    console.error("Erro Ao Aprovar Retirada");   
  }
}

function logs() {
  document.getElementById('urlSistema').innerText = '/ Inicio / Logs';
  document.getElementById('options').style.display = 'none';
  document.getElementById('resumo').style.display = 'none';
  document.getElementById('logObjetos').style.display = 'flex';

  const tabela = document.getElementById('tabelaLogs').getElementsByTagName('tbody')[0];
  tabela.innerHTML = ''; 
  fetch('http://localhost:3333/logs')
    .then(response => response.json())
    .then(data => {
      data.forEach(log => {
        const dataFormatadaAdicionado = formatarData(log.data_adicionado);
        const dataFormatadaMovimentacao = formatarData(log.data_movimentacao);
        const situacao = log.situacao.toUpperCase();
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
          <td>${log.id_log}</td>
          <td>${log.id_item}</td>
          <td>${log.nome_item}</td>
          <td>${dataFormatadaAdicionado}</td>
          <td>${dataFormatadaMovimentacao}</td>
          <td>${situacao}</td>
          <td>${log.retirado_por}</td>
          <td>${log.clAluno}</td>
          <td id="botoes">
            <button onclick="excluir_log(${log.id_log})">Excluir</button>
          </td>
        `;
        tabela.appendChild(novaLinha);
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
}


function excluir_log(id){
  const confirmacao = window.confirm("Deseja excluir este log?");
  if(confirmacao){
    fetch(`http://localhost:3333/logs/excluir/${id}`, {
      method: "DELETE",
  })
  }
  window.alert("Log apagado!");
  logs();
}


function Sair(){
  let sair = window.confirm("Deseja Sair?")
}