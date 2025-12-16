const btnCadastrarLivro = document.querySelector("#cadastrarLivro");

function Livro(
  issn,
  titulo,
  autor,
  editora,
  ano,
  genero,
  local,
  disponibilidade,
  url
) {
  this.issn = issn;
  this.titulo = titulo;
  this.autor = autor;
  this.editora = editora;
  this.ano = ano;
  this.genero = genero;
  this.local = local;
  this.disponivel = disponibilidade;
  this.url = url;
}

async function cadastrarExemplar(event) {
  event.preventDefault(); 

  const url = "http://localhost/bribrioteca/?modulo=livro";

  const issn = document.querySelector("#novoIssn").value;
  const titulo = document.querySelector("#novoTitulo").value;
  const autor = document.querySelector("#novoAutor").value;
  const editora = document.querySelector("#novoEditora").value;
  const ano = document.querySelector("#novoAno").value;
  const genero = document.querySelector("#novoGenero").value;
  const local = document.querySelector("#novoLocal").value;
  const imagem = document.querySelector("#novaImagem").value;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      new Livro(issn, titulo, autor, editora, ano, genero, local, null, imagem)
    ),
  });

  const retorno = await response.json();
  console.log(retorno);
  alert(retorno.mensagem);
}

btnCadastrarLivro.addEventListener("click", cadastrarExemplar);
