
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


document.getElementById('meuForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const local = document.getElementById('local').value;
    const extra = document.getElementById('extra_local').value;
    let localItem;


    if(local == "Sala"){
        localItem = local + " " + extra;
    }
    else{
        localItem = local;
    }

    const formData = new FormData();
    formData.append('nome_item', document.getElementById('nome_item').value);
    formData.append('data_encontrado', document.getElementById('date').value);
    formData.append('local_encontrado', localItem);
    formData.append('imagem_url', document.getElementById('imagem_url').files[0]);


    try {
        const response = await fetch('http://localhost:3333/adicionar', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert(error.message);
    }
});

function usuario(){
  const conteudo = document.getElementById('tste');
  conteudo.innerHTML = '';
  fetch('http://localhost:3333/usuarios/pendentes') 
  .then(response => response.json()) 
  .then(data => {
    data.forEach(usuario => {
    const dataAtual = usuario.data_encontrado
    const dataFormatada = formatarData(dataAtual)
    const div = document.createElement("div")
    div.className = 'Item'
    div.innerHTML = `
    <p><strong>Nome:</strong> ${usuario.nome_item}</p>
    <p><strong>Data:</strong> ${dataFormatada}</p>
    <p><strong>Local:</strong> ${usuario.local_encontrado}</p>
    <p><strong>Imagem:</strong> <img src="${usuario.imagem_url}" alt="Imagem do item" style="max-width: 200px;"></p>
    <button onclick=aprovar_item(${usuario.id_item})>Aprovar</button>`; 
    conteudo.appendChild(div);

    });
  })
  .catch(error => console.error('Erro ao buscar os dados:', error));
}

function usuariodisponivel(){
    const conteudo = document.getElementById('tste');
    conteudo.innerHTML = '';
    fetch('http://localhost:3333/usuarios/disponiveis') 
    .then(response => response.json()) 
    .then(data => {
      data.forEach(usuario => {
      const div = document.createElement("div");
      div.className = 'Item'
      div.innerHTML = `
      <p><strong>Nome:</strong> ${usuario.nome_item}</p>
      <p><strong>Data:</strong> ${usuario.data_encontrado}</p>
      <p><strong>Local:</strong> ${usuario.local_encontrado}</p>
      <p><strong>Imagem:</strong> <img src="${usuario.imagem_url}" alt="Imagem do item" style="max-width: 200px;"></p>
      <button onclick=deletar_item(${usuario.id_item})>Feletar</button>`; 
      conteudo.appendChild(div);
  
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
  }


  function logs(){
    const conteudo = document.getElementById('logs');
    conteudo.innerHTML = '';
    fetch('http://localhost:3333/logs') 
    .then(response => response.json()) 
    .then(data => {
      data.forEach(log => {
      const dataAtual1 = log.data_adicionado
      const dataAtual2 = log.data_movimentacao
      const dataFormatadaAdicionado = formatarData(dataAtual1)
      const dataFormatadaMovimentacao = formatarData(dataAtual2)
      const tabela = document.getElementById('tabelaLogs').getElementsByTagName('tbody')[0];
      const novaLinha = document.createElement('tr'); 
      novaLinha.innerHTML = `
      <td>${log.id_log}</td>
      <td>${log.id_item}</td>
      <td>${log.nome_item}</td>
      <td>${dataFormatadaAdicionado}</td>
      <td>${dataFormatadaMovimentacao}</td>
      <td>${log.situacao}</td>
      <td>${log.retirado_por}</td>
      <td>${log.clAluno}</td>
      <td id="botoes">
        <button onclick="excluir_log(${log.id_log})">Excluir</button>
        <button onclick="retirarItem(${log.id_item})">Retirar</button>
      </td>`
      tabela.appendChild(novaLinha);
      });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));
    }

function aprovar_item(id){
    fetch(`http://localhost:3333/usuarios/pendentes/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Disponível"
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Erro ao atualizar status:", error));
    
}



function deletar_item(id){
    fetch(`http://localhost:3333/usuarios/excluir/${id}`, {
        method: "DELETE",
    })
}



function excluir_log(id){
    fetch(`http://localhost:3333/logs/excluir/${id}`, {
        method: "DELETE",
    })
    window.alert("Log apagado!");
}



function retirarItem(id){
    const agora = new Date();
    const dataHoraISO = agora.toISOString();
    const dataFormatada = dataHoraISO.replace('T', ' ').slice(0, 19);  
    let nomePessoal = prompt("Digite o Nome: ");
    window.alert(dataHoraISO)
    window.alert(nomePessoal)
    if(nomePessoal.trim() === ""){
        window.alert('Digite o o nome corretamente!');
        return;
    }
    else{

        const data = {
            data_movimentacao: dataFormatada,
            retirado_por: nomePessoal
        
        };

        fetch(`http://localhost:3333/retirarItem/${id}`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        deletar_item(id);
    }
}