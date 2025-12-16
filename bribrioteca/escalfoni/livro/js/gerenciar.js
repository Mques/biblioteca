const btnConsultarLivros = document.querySelector("#consultarLivros");
const btnListarTodosLivros = document.querySelector("#listarLivros");

const URL_API = "http://localhost/bribrioteca/index.php?modulo=livro";  


function resetarDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}



function criarTabela(livros, div) {
  const tabela = document.createElement("table");

  tabela.innerHTML = `
    <tr>
      <th>Imagem</th>
      <th>Título</th>
      <th>Autor</th>
      <th>Disponibilidade</th>
      <th>Ações</th>
    </tr>
  `;

  livros.forEach((livro) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td><img src="${livro.URL}" width="120"></td>
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>
        <span id="disponibilidade-${livro.id}">${livro.disponibilidade}</span>
      </td>
      <td>
        <button data-id="${livro.id}" class="alterar">Alterar</button>
        <button data-id="${livro.id}" class="detalhes">Detalhes</button>
        <button data-id="${livro.id}" class="excluir">Excluir</button>
        <button data-id="${livro.id}" class="alterarDisponibilidade">Alterar Disponibilidade</button>
      </td>
    `;

    tabela.appendChild(linha);
  });

  div.appendChild(tabela);

s
  document.querySelectorAll(".alterar").forEach((btn) => {
    btn.addEventListener("click", carregarDadosAlterarLivro);
  });

  document.querySelectorAll(".detalhes").forEach((btn) => {
    btn.addEventListener("click", mostrarDetalhes);
  });

  document.querySelectorAll(".excluir").forEach((btn) => {
    btn.addEventListener("click", excluirLivro);
  });


  document.querySelectorAll(".alterarDisponibilidade").forEach((btn) => {
    btn.addEventListener("click", alterarDisponibilidade);
  });
}

async function alterarDisponibilidade() {
  const id = this.dataset.id;
  const disponibilidadeElement = document.querySelector(`#disponibilidade-${id}`);
  const disponibilidadeAtual = disponibilidadeElement.textContent;


  const novaDisponibilidade = disponibilidadeAtual === "Sim" ? "Não" : "Sim";
  
  try {

    const response = await fetch(URL_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, disponibilidade: novaDisponibilidade }),
    });

    if (!response.ok) {
      throw new Error("Erro ao alterar a disponibilidade do livro");
    }
    disponibilidadeElement.textContent = novaDisponibilidade;
    alert("Disponibilidade alterada com sucesso!");
  } catch (error) {
    console.error("Erro ao alterar a disponibilidade:", error);
    alert("Erro ao alterar a disponibilidade.");
  }
}

async function listarTodos() {
  try {
    const response = await fetch(URL_API);
    
    if (!response.ok) {
      throw new Error("Erro ao acessar a API: " + response.statusText);
    }

    const livros = await response.json();

    const div = document.querySelector("#saidaBusca");
    resetarDiv(div);
    criarTabela(livros, div);
  } catch (error) {
    console.error("Erro ao listar livros:", error);
    alert("Ocorreu um erro ao listar os livros. Verifique o backend.");
  }
}


async function consultarLivros() {
  const filtro = document.querySelector("#busca").value.toLowerCase();

  try {
    const response = await fetch(URL_API);

    if (!response.ok) {
      throw new Error("Erro ao acessar a API: " + response.statusText);
    }

    const livros = await response.json();
    const filtrados = livros.filter(
      (livro) =>
        livro.titulo.toLowerCase().includes(filtro) ||
        livro.autor.toLowerCase().includes(filtro) ||
        livro.genero.toLowerCase().includes(filtro)
    );

    const div = document.querySelector("#saidaBusca");
    resetarDiv(div);
    criarTabela(filtrados, div);
  } catch (error) {
    console.error("Erro ao consultar livros:", error);
    alert("Ocorreu um erro ao consultar os livros.");
  }
}

async function excluirLivro() {
  const id = this.dataset.id;

  if (!confirm("Deseja realmente excluir este livro?")) return;

  try {
    const response = await fetch(URL_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o livro: " + response.statusText);
    }

    alert("Livro excluído com sucesso!");
    listarTodos();
  } catch (error) {
    console.error("Erro ao excluir livro:", error);
    alert("Erro ao excluir livro.");
  }
}

function carregarDadosAlterarLivro() {
  const id = this.dataset.id;

  fetch(`${URL_API}&id=${id}`)
    .then((response) => response.json())
    .then((livro) => {
      if (livro) {
        document.querySelector("#editTitulo").value = livro.titulo;
        document.querySelector("#editAutor").value = livro.autor;
        document.querySelector("#editEditora").value = livro.editora;
        document.querySelector("#editAnoPublicacao").value = livro.anoPublicacao;
        document.querySelector("#editGenero").value = livro.genero;
        document.querySelector("#editLocalizacao").value = livro.localizacao;
        document.querySelector("#editIssn").value = livro.issn;
        document.querySelector("#editDisponibilidade").value = livro.disponibilidade;
        document.querySelector("#editUrl").value = livro.url;

        const form = document.querySelector("#formAlterarLivro");
        form.style.display = "block";

        const btnSalvar = document.querySelector("#formAlterarLivro button");
        btnSalvar.onclick = (e) => {
          e.preventDefault();
          alterarLivro(id);
        };

        const btnCancelar = document.querySelector("#cancelarEdicaoLivro");
        btnCancelar.onclick = () => {
          form.style.display = "none";
        };
      } else {
        alert("Livro não encontrado");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do livro:", error);
      alert("Erro ao carregar dados do livro.");
    });
}

async function alterarLivro(id) {
  const titulo = document.querySelector("#editTitulo").value;
  const autor = document.querySelector("#editAutor").value;
  const editora = document.querySelector("#editEditora").value;
  const anoPublicacao = document.querySelector("#editAnoPublicacao").value;
  const genero = document.querySelector("#editGenero").value;
  const localizacao = document.querySelector("#editLocalizacao").value;
  const issn = document.querySelector("#editIssn").value;
  const disponibilidade = document.querySelector("#editDisponibilidade").value;
  const url = document.querySelector("#editUrl").value;

  const livro = { id, titulo, autor, editora, anoPublicacao, genero, localizacao, issn, disponibilidade, url };

  try {
    const response = await fetch(URL_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livro),
    });

    const text = await response.text();
    let resultado = null;

    try {
      resultado = JSON.parse(text);
    } catch (e) {
      throw new Error("Resposta inválida do servidor: " + text);
    }

    if (resultado.erro) {
      alert("Erro ao alterar livro: " + resultado.mensagem);
    } else {
      alert("Livro alterado com sucesso!");
      listarTodos();
      document.querySelector("#formAlterarLivro").style.display = "none";
    }
  } catch (e) {
    console.error("Erro ao alterar livro:", e);
    alert("Erro ao alterar livro: " + e.message);
  }
}



async function mostrarDetalhes() {
  const id = this.dataset.id;  

  try {
    const response = await fetch(`http://localhost/bribrioteca/index.php?modulo=livro&id=${id}`); 
    if (!response.ok) {
      throw new Error("Erro ao carregar os dados do livro");
    }

    const livro = await response.json();
    document.querySelector("#detTitulo").textContent = livro[0].titulo;
    document.querySelector("#detAutor").textContent = livro[0].autor;
    document.querySelector("#detEditora").textContent = livro[0].editora;
    document.querySelector("#detAno").textContent = livro[0].anoPublicacao;
    document.querySelector("#detGenero").textContent = livro[0].genero;
    document.querySelector("#detLocalizacao").textContent = livro[0].localizacao;
    document.querySelector("#detDisponibilidade").textContent = livro[0].disponibilidade;
    document.querySelector("#detImagem").src = livro[0].url;


    document.querySelector(".backgroundPopup").style.display = "flex";
    document.querySelector(".popup").style.display = "block";  
  } catch (e) {
    console.error("Erro ao carregar detalhes:", e);
    alert("Erro ao carregar detalhes do livro");
  }
}


function fecharPopup() {
  const background = document.querySelector(".backgroundPopup");
  const popup = document.querySelector(".popup");

  background.style.display = "none";  
  popup.style.display = "none"; 
}

function fecharPopup() {
  const background = document.querySelector(".backgroundPopup");
  const popups = document.querySelectorAll(".popup");

  background.style.display = "none"; 
  popups.forEach((popup) => {
    popup.style.display = "none"; 
  });
}

btnConsultarLivros.addEventListener("click", consultarLivros);
btnListarTodosLivros.addEventListener("click", listarTodos);
